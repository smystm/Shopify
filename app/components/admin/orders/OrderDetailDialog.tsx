"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import {
   CheckCircleIcon,
   LinkIcon,
   PhotoIcon,
   ReceiptRefundIcon,
   ShoppingBagIcon,
   TruckIcon,
   UserCircleIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { AdminOrder, OrderStatus } from "@/app/contracts/panel"
import { orderItemImage, orderItemLabel, orderItemQuantity, orderItemUnitHint } from "@/app/lib/orderItems"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"
import OrderStatusBadge from "@/app/components/ui/OrderStatusBadge"
import OrderTimeline from "@/app/components/panel/OrderTimeline"
import { OrderAdminError, registerTradeOffer, transitionOrderStatus } from "@/app/helpers/adminOrdersApi"

/**
 * Which next statuses an order may legally take — the client-side mirror of the
 * backend's ALLOWED_TRANSITIONS (app/services/orders.js). It is what decides
 * which action buttons exist at all: an admin never sees a button the server
 * would refuse, and a terminal order shows no buttons at all.
 */
const ALLOWED_NEXT: Record<OrderStatus, OrderStatus[]> = {
   pending_payment: ["in_escrow", "cancelled", "refunded"],
   in_escrow: ["trade_sent", "completed", "disputed", "refunded", "cancelled"],
   trade_sent: ["completed", "disputed", "refunded"],
   disputed: ["completed", "refunded"],
   completed: [],
   refunded: [],
   cancelled: [],
}

/** The share-link shape Steam produces for one specific sent offer. */
const OFFER_URL_PATTERN = /^https:\/\/steamcommunity\.com\/tradeoffer\/[0-9]+\/?$/

function describeError(err: unknown): string {
   if (err instanceof OrderAdminError) {
      return fa.admin.orders.errors[err.code as keyof typeof fa.admin.orders.errors] ?? fa.admin.orders.errors.UNKNOWN
   }
   return fa.admin.orders.errors.UNKNOWN
}

function formatDateTime(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ms))
}

interface OrderDetailDialogProps {
   order: AdminOrder
   /** Present only for FullAcc viewers, whose requests the backend would also accept. */
   canManage: boolean
   onClose: () => void
   /** Called after every successful mutation, so the list refetches itself. */
   onChanged: () => void
}

type ConfirmAction = "completed" | "refunded" | "cancelled"

/** Which fa.admin.orders.confirm.* subset each action copies from. */
const CONFIRM_KEY: Record<ConfirmAction, "delivered" | "refund" | "cancel"> = {
   completed: "delivered",
   refunded: "refund",
   cancelled: "cancel",
}

export default function OrderDetailDialog({ order, canManage, onClose, onChanged }: OrderDetailDialogProps) {
   const prefersReduced = useReducedMotion()
   const [working, setWorking] = useState(false)
   const [confirming, setConfirming] = useState<ConfirmAction | null>(null)
   const [offerFormOpen, setOfferFormOpen] = useState(false)
   const [offerUrl, setOfferUrl] = useState("")
   const [offerError, setOfferError] = useState<string | null>(null)
   const [actionError, setActionError] = useState<string | null>(null)

   const nextStatuses = ALLOWED_NEXT[order.status] ?? []
   const isTerminal = nextStatuses.length === 0
   const canSendOffer = canManage && !isTerminal && nextStatuses.includes("trade_sent") && order.items.some((item) => item.product_id)
   const canComplete = canManage && !isTerminal && nextStatuses.includes("completed")
   const canRefund = canManage && !isTerminal && nextStatuses.includes("refunded")
   const canCancel = canManage && !isTerminal && nextStatuses.includes("cancelled")
   const customer = order

   const handleTransition = async (status: OrderStatus) => {
      setWorking(true)
      setActionError(null)

      try {
         await transitionOrderStatus(order.id, status)
         setConfirming(null)
         onChanged()
      } catch (err) {
         const message = describeError(err)
         setActionError(message)
      } finally {
         setWorking(false)
      }
   }

   const handleSendOffer = async (event: React.FormEvent) => {
      event.preventDefault()
      setOfferError(null)

      if (!OFFER_URL_PATTERN.test(offerUrl.trim())) {
         setOfferError(fa.admin.orders.errors.INVALID_OFFER_URL)
         return
      }

      setWorking(true)
      try {
         await registerTradeOffer(order.id, offerUrl.trim())
         setOfferFormOpen(false)
         setOfferUrl("")
         onChanged()
      } catch (err) {
         setOfferError(describeError(err))
      } finally {
         setWorking(false)
      }
   }

   return (
      <Dialog open={true} onClose={onClose} className="relative z-50">
         <DialogBackdrop
            transition
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0"
         />
         <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
               <DialogPanel
                  transition
                  className="w-full max-w-2xl rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl shadow-navy-900/20 transition data-closed:scale-95 data-closed:opacity-0 dark:shadow-black/40"
               >
                  {/* ---------- Header ---------- */}
                  <div className="flex items-start justify-between gap-4">
                     <div className="min-w-0">
                        <DialogTitle className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-base font-bold text-navy-950 dark:text-white">
                           {fa.admin.orders.detail.orderLabel}{" "}
                           <span dir="ltr">#{order.id.toLocaleString("en-US")}</span>
                           <OrderStatusBadge status={order.status} />
                        </DialogTitle>
                        <p className="mt-1 text-sm text-navy-500 dark:text-navy-400" dir="ltr">
                           {formatDateTime(order.created_at)}
                        </p>
                     </div>
                     <button
                        type="button"
                        onClick={onClose}
                        aria-label={fa.admin.dialog.close}
                        className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:hover:bg-navy-800 dark:hover:text-brand-300"
                     >
                        <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                     </button>
                  </div>

                  {/* ---------- The journey ---------- */}
                  <div className="mt-5">
                     <OrderTimeline status={order.status} includesTradeStep={order.items.some((item) => item.product_id)} />
                  </div>

                  {isTerminal ? (
                     <p className="mt-4 flex items-center gap-2 rounded-xl bg-navy-100/70 px-4 py-3 text-xs font-semibold text-navy-600 dark:bg-navy-900/60 dark:text-navy-300">
                        <CheckCircleIcon className="h-4 w-4 text-navy-400" aria-hidden="true" />
                        {fa.admin.orders.detail.terminalNote}
                     </p>
                  ) : null}

                  {/* ---------- Items ---------- */}
                  <section className="mt-5 rounded-2xl border border-border-subtle bg-surface-muted/50 p-4">
                     <h3 className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                        <ShoppingBagIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                        {fa.admin.orders.detail.itemsTitle}
                        <span className="text-xs font-semibold text-navy-500 dark:text-navy-400">
                           {fa.panel.orders.itemsCount.replace("{count}", String(order.items.length))}
                        </span>
                     </h3>
                     <ul className="mt-3 space-y-2">
                        {order.items.map((item) => {
                           const image = orderItemImage(item)
                           const quantity = orderItemQuantity(item)
                           const unitHint = orderItemUnitHint(item)

                           return (
                              <li
                                 key={item.id}
                                 className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-3 py-2.5"
                              >
                                 <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-surface-muted">
                                    {image ? (
                                       <Image src={image} alt="" fill sizes="40px" className={`p-1 ${item.service ? "object-cover" : "object-contain"}`} unoptimized />
                                    ) : (
                                       <PhotoIcon className="h-4 w-4 text-navy-300 dark:text-navy-600" aria-hidden="true" />
                                    )}
                                 </span>
                                 <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-2">
                                       <span className="truncate text-sm font-semibold text-navy-950 dark:text-white">
                                          {orderItemLabel(item)}
                                       </span>
                                       {quantity ? (
                                          <span className="rounded-full bg-brand-500/12 px-2 py-0.5 text-[10px] font-extrabold text-brand-700 dark:text-brand-300">
                                             {fa.panel.orders.quantityBadge.replace("{quantity}", String(quantity))}
                                          </span>
                                       ) : null}
                                    </span>
                                    {unitHint ? (
                                       <span className="mt-0.5 block text-[11px] text-navy-500 dark:text-navy-400">{unitHint}</span>
                                    ) : null}
                                 </span>
                                 <span className="text-sm font-bold text-navy-700 dark:text-navy-200" dir="ltr">
                                    {Number.isFinite(Number(item.price)) ? formatToman(Number(item.price)) : "—"}
                                 </span>
                              </li>
                           )
                        })}
                     </ul>
                     <p className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3 text-sm font-bold text-navy-950 dark:text-white">
                        <span>{fa.admin.orders.detail.totalLabel}</span>
                        <span dir="ltr">{formatToman(Number(order.total))}</span>
                     </p>
                  </section>

                  {/* ---------- The buyer, who the trade must reach ---------- */}
                  <section className="mt-4 rounded-2xl border border-border-subtle p-4">
                     <h3 className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                        <UserCircleIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                        {fa.admin.orders.detail.customerTitle}
                     </h3>
                     <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                           <dt className="text-xs text-navy-500 dark:text-navy-400">{fa.admin.orders.detail.customerName}</dt>
                           <dd className="font-semibold text-navy-900 dark:text-white">
                              {customer.user_name || "—"}
                           </dd>
                        </div>
                        <div>
                           <dt className="text-xs text-navy-500 dark:text-navy-400">{fa.admin.orders.detail.customerPhone}</dt>
                           <dd className="truncate font-semibold text-navy-900 dark:text-white" dir="ltr">
                              {customer.user_phone || "—"}
                           </dd>
                        </div>
                        <div>
                           <dt className="text-xs text-navy-500 dark:text-navy-400">{fa.admin.orders.detail.customerEmail}</dt>
                           <dd className="truncate font-semibold text-navy-900 dark:text-white" dir="ltr">
                              {customer.user_email || "—"}
                           </dd>
                        </div>
                        <div>
                           <dt className="text-xs text-navy-500 dark:text-navy-400">{fa.admin.orders.detail.steamId}</dt>
                           <dd className="truncate font-semibold text-navy-900 dark:text-white" dir="ltr" title={customer.user_steam_id ?? undefined}>
                              {customer.user_steam_id || "—"}
                           </dd>
                        </div>
                     </dl>
                     <div className="mt-3 border-t border-border-subtle pt-3">
                        <dt className="text-xs text-navy-500 dark:text-navy-400">{fa.admin.orders.detail.tradeUrl}</dt>
                        {customer.user_trade_url ? (
                           <dd className="mt-1 flex items-center gap-2">
                              <a
                                 href={customer.user_trade_url}
                                 target="_blank"
                                 rel="noreferrer noopener"
                                 className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/12 px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-500/20 dark:text-brand-300"
                              >
                                 <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                 {fa.admin.orders.detail.tradeUrlOpen}
                              </a>
                           </dd>
                        ) : (
                           <dd className="mt-1 rounded-xl bg-accent-500/10 px-3 py-2 text-xs font-semibold text-accent-800 dark:text-accent-300">
                              {fa.admin.orders.detail.tradeUrlMissing}
                           </dd>
                        )}
                     </div>
                  </section>

                  {/* ---------- Back-office actions ---------- */}
                  {canManage && !isTerminal ? (
                     <section className="mt-4 rounded-2xl border border-border-strong bg-navy-50/60 p-4 dark:bg-navy-900/40">
                        <div className="flex flex-wrap items-center gap-2">
                           {canSendOffer ? (
                              <button
                                 type="button"
                                 onClick={() => setOfferFormOpen((prev) => !prev)}
                                 aria-expanded={offerFormOpen}
                                 className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-700/25 transition-all hover:shadow-lg hover:shadow-brand-700/35"
                              >
                                 <TruckIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.admin.orders.actions.sendTradeOffer}
                              </button>
                           ) : null}

                           {canComplete ? (
                              <button
                                 type="button"
                                 onClick={() => setConfirming("completed")}
                                 className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-emerald-600/10 px-4 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-600/20 dark:border-emerald-400/30 dark:text-emerald-300"
                              >
                                 <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.admin.orders.actions.markDelivered}
                              </button>
                           ) : null}

                           {canCancel ? (
                              <button
                                 type="button"
                                 onClick={() => setConfirming("cancelled")}
                                 className="inline-flex items-center gap-1.5 rounded-full border border-navy-300 px-4 py-2.5 text-xs font-bold text-navy-700 transition-colors hover:border-red-400 hover:text-red-700 dark:border-navy-600 dark:text-navy-200 dark:hover:border-red-400/50 dark:hover:text-red-300"
                              >
                                 <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.admin.orders.actions.cancel}
                              </button>
                           ) : null}

                           {canRefund ? (
                              <button
                                 type="button"
                                 onClick={() => setConfirming("refunded")}
                                 className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-500/20 dark:border-red-400/30 dark:text-red-300"
                              >
                                 <ReceiptRefundIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.admin.orders.actions.refund}
                              </button>
                           ) : null}
                        </div>

                        <AnimatePresence initial={false}>
                           {offerFormOpen ? (
                              <motion.form
                                 key="offer-form"
                                 initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                 transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                 onSubmit={handleSendOffer}
                                 className="overflow-hidden"
                              >
                                 <div className="mt-4 space-y-1 border-t border-border-subtle pt-4">
                                    <p className="text-xs leading-6 text-navy-600 dark:text-navy-300">
                                       {fa.admin.orders.tradeOffer.body}
                                    </p>
                                    <label htmlFor="offer-url" className="mt-2 block text-xs font-bold text-navy-800 dark:text-navy-100">
                                       {fa.admin.orders.tradeOffer.urlLabel}
                                    </label>
                                    <input
                                       id="offer-url"
                                       type="url"
                                       dir="ltr"
                                       value={offerUrl}
                                       onChange={(e) => setOfferUrl(e.target.value)}
                                       placeholder={fa.admin.orders.tradeOffer.urlPlaceholder}
                                       className="mt-1 block w-full rounded-xl border border-navy-300 bg-surface px-3.5 py-2.5 text-sm text-navy-950 shadow-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                                    />
                                    <p className="mt-1 text-[11px] leading-5 text-navy-500 dark:text-navy-400">
                                       {fa.admin.orders.tradeOffer.urlHint}
                                    </p>
                                    {offerError ? (
                                       <p className="text-xs font-semibold text-red-600 dark:text-red-400">{offerError}</p>
                                    ) : null}
                                    <div className="flex justify-end gap-2 pt-1">
                                       <button
                                          type="button"
                                          onClick={() => setOfferFormOpen(false)}
                                          className="rounded-full border border-navy-300 px-4 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-navy-600 dark:text-navy-200"
                                       >
                                          {fa.admin.dialog.cancel}
                                       </button>
                                       <button
                                          type="submit"
                                          disabled={working || offerUrl.trim() === ""}
                                          className="rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-700/25 transition-all hover:shadow-lg hover:shadow-brand-700/35 disabled:cursor-not-allowed disabled:opacity-50"
                                       >
                                          {working ? fa.admin.orders.actions.working : fa.admin.orders.tradeOffer.submit}
                                       </button>
                                    </div>
                                 </div>
                              </motion.form>
                           ) : null}
                        </AnimatePresence>

                        {/* The one-click-is-irreversible actions confirm themselves
                            inline, in the same dialog, so an audit-minded operator
                            never acts on a mis-click. */}
                        {confirming ? (
                           <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3">
                              {(() => {
                                 const copy = fa.admin.orders.confirm[CONFIRM_KEY[confirming]]
                                 return (
                                    <>
                                       <p className="text-sm font-bold text-navy-950 dark:text-white">{copy.title}</p>
                                       <p className="mt-1 text-xs leading-6 text-navy-600 dark:text-navy-300">
                                          {copy.body.replace("{id}", order.id.toLocaleString("en-US"))}
                                       </p>
                                    </>
                                 )
                              })()}
                              <div className="mt-3 flex justify-end gap-2">
                                 <button
                                    type="button"
                                    onClick={() => setConfirming(null)}
                                    className="rounded-full border border-navy-300 px-4 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-brand-400 dark:border-navy-600 dark:text-navy-200"
                                 >
                                    {fa.admin.dialog.cancel}
                                 </button>
                                 <button
                                    type="button"
                                    disabled={working}
                                    onClick={() => handleTransition(confirming)}
                                    className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/25 transition-all hover:shadow-lg hover:shadow-red-600/35 disabled:cursor-not-allowed disabled:opacity-50"
                                 >
                                    {fa.admin.orders.confirm.yes}
                                 </button>
                              </div>
                           </div>
                        ) : null}

                        {actionError ? (
                           <p className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">{actionError}</p>
                        ) : null}
                     </section>
                  ) : null}
               </DialogPanel>
            </div>
         </div>
      </Dialog>
   )
}
