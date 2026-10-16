"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRightIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, ShoppingBagIcon, TruckIcon } from "@heroicons/react/24/outline"
import type { Order } from "@/app/contracts/panel"
import { getOrder } from "@/app/helpers/panelApi"
import OrderStatusBadge from "@/app/components/ui/OrderStatusBadge"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"
import { orderItemImage, orderItemLabel, orderItemQuantity } from "@/app/lib/orderItems"

interface OrderDetailClientProps {
   orderId: number
   /** Set by the cart's redirect, so the confirmation is shown once, on arrival. */
   justPlaced: boolean
}

/** Persian (Jalali-friendly) date without pulling in a date library. */
function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeStyle: "short" }).format(new Date(ms))
}

/**
 * One order, on its own page.
 *
 * This is where checkout lands, and it is deliberately not the cart: an order is a
 * frozen snapshot - its items, their prices and its total were all written once and
 * are never recomputed - so it has to be read somewhere that cannot edit it. The
 * cart is the editable thing and it is a different URL.
 *
 * The id comes from the route rather than a list, and the backend scopes the lookup
 * to the signed-in customer, so a guessed id 404s instead of showing somebody
 * else's order.
 */
export default function OrderDetailClient({ orderId, justPlaced }: OrderDetailClientProps) {
   const prefersReduced = useReducedMotion()
   const router = useRouter()
   const [order, setOrder] = useState<Order | null>(null)
   const [loading, setLoading] = useState(true)
   const [failed, setFailed] = useState(false)

   useEffect(() => {
      let cancelled = false

      getOrder(orderId)
         .then((found) => {
            if (cancelled) return
            setOrder(found)
            setFailed(!found)
         })
         .catch(() => {
            if (!cancelled) setFailed(true)
         })
         .finally(() => {
            if (!cancelled) setLoading(false)
         })

      return () => {
         cancelled = true
      }
   }, [orderId])

   if (loading) {
      return (
         <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
            <div className="rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
               <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                  <div className="h-6 w-24 animate-pulse rounded-full bg-navy-200 dark:bg-navy-800" />
               </div>
               <div className="mt-6 space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="h-16 w-16 animate-pulse rounded-xl bg-navy-200 dark:bg-navy-800" />
                        <div className="flex-1 space-y-2">
                           <div className="h-4 w-40 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                           <div className="h-3 w-24 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <p className="sr-only">{fa.panel.orders.loadingOrder}</p>
         </div>
      )
   }

   if (failed || !order) {
      return (
         <Reveal>
            <EmptyState
               icon={<ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />}
               title={fa.panel.orders.notFoundTitle}
               body={fa.panel.orders.notFoundBody}
               action={{ label: fa.panel.orders.notFoundCta, onClick: () => router.push("/panel/orders") }}
            />
         </Reveal>
      )
   }

   const units = order.items.reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0)

   return (
      <div>
         <Reveal>
            <Link
               href="/panel/orders"
               className="group inline-flex items-center gap-2 text-sm font-bold text-navy-600 transition-colors duration-300 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300"
            >
               <ArrowRightIcon
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:scale-x-[-1] rtl:group-hover:-translate-x-1"
                  aria-hidden="true"
               />
               {fa.panel.orders.backToOrders}
            </Link>
         </Reveal>

         {/* Shown only on the landing after a real checkout, which is the one moment
             the customer needs to be told that money moved and where. */}
         {justPlaced ? (
            <motion.div
               initial={prefersReduced ? false : { opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
               className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-500/40 bg-linear-to-bl from-brand-50 to-surface px-5 py-4 shadow-md shadow-brand-500/10 dark:border-brand-400/30 dark:from-brand-500/10 dark:to-navy-950"
            >
               <motion.span
                  initial={prefersReduced ? false : { scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 460, damping: 18, delay: 0.12 }}
                  className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300"
               >
                  <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
               </motion.span>
               <span>
                  <span className="block text-sm font-extrabold text-navy-950 dark:text-white">{fa.panel.orders.placedTitle}</span>
                  <span className="mt-1 block text-xs leading-6 text-navy-600 dark:text-navy-300">{fa.panel.orders.placedBody}</span>
               </span>
            </motion.div>
         ) : null}

         <Reveal>
            <div className="mt-6 overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-lg shadow-navy-900/5">
               {/* ---------- Header ---------- */}
               <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-linear-to-bl from-brand-50/70 to-surface px-6 py-5 dark:from-brand-500/10 dark:to-navy-950">
                  <div>
                     <p className="text-[11px] font-bold tracking-wide text-navy-500 dark:text-navy-400">
                        {fa.panel.orders.orderNumber}
                     </p>
                     <p className="mt-1 text-xl font-extrabold text-navy-950 dark:text-white" dir="ltr">
                        #{order.id.toLocaleString("en-US")}
                     </p>
                     <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                        {fa.panel.orders.placedAt}: {formatDate(order.created_at)}
                     </p>
                  </div>

                  <OrderStatusBadge status={order.status} />
               </div>

               {/* ---------- Items ---------- */}
               <div className="px-6 py-6">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                     <ClipboardDocumentCheckIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                     {fa.panel.orders.items}
                     <span className="text-xs font-medium text-navy-500 dark:text-navy-400">
                        ({fa.panel.orders.itemsCount.replace("{count}", units.toLocaleString("fa-IR"))})
                     </span>
                  </h2>

                  <ul className="mt-5 divide-y divide-border-subtle">
                     {order.items.map((item) => {
                        const label = orderItemLabel(item)
                        const image = orderItemImage(item)
                        const quantity = orderItemQuantity(item) ?? 1

                        return (
                           <li key={item.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-muted">
                                 {image ? (
                                    <Image
                                       src={image}
                                       alt=""
                                       fill
                                       sizes="64px"
                                       className={`p-2 ${item.service ? "object-cover" : "object-contain"}`}
                                       unoptimized
                                    />
                                 ) : (
                                    <ShoppingBagIcon className="h-5 w-5 text-navy-400" aria-hidden="true" />
                                 )}
                              </span>

                              <span className="min-w-0 flex-1">
                                 <span className="block text-sm font-bold text-navy-950 dark:text-white">{label}</span>
                                 <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-500 dark:text-navy-400">
                                    <span>
                                       {fa.panel.orders.unitPriceEach}:{" "}
                                       <span dir="ltr">
                                          {formatToman(Number(item.price))} {fa.currency}
                                       </span>
                                    </span>
                                    {quantity > 1 ? (
                                       <span className="rounded-full bg-navy-100 px-2 py-0.5 font-bold dark:bg-navy-800" dir="ltr">
                                          × {quantity}
                                       </span>
                                    ) : null}
                                 </span>
                              </span>

                              <span
                                 dir="ltr"
                                 className="shrink-0 text-sm font-extrabold text-navy-950 dark:text-white"
                              >
                                 {formatToman(Number(item.price) * quantity)}
                              </span>
                           </li>
                        )
                     })}
                  </ul>
               </div>

               {/* ---------- Totals ---------- */}
               <div className="border-t border-border-subtle px-6 py-5">
                  <dl className="space-y-3 text-sm">
                     <div className="flex items-center justify-between gap-3">
                        <dt className="text-navy-600 dark:text-navy-300">{fa.panel.orders.itemsTotal}</dt>
                        <dd className="font-bold text-navy-950 dark:text-white" dir="ltr">
                           {formatToman(order.items.reduce((total, item) => total + Number(item.price) * Math.max(1, Number(item.quantity) || 1), 0))}
                        </dd>
                     </div>
                     <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
                        <dt className="text-navy-600 dark:text-navy-300">{fa.panel.orders.total}</dt>
                        <dd className="flex items-center gap-2">
                           <span className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-xl font-extrabold text-transparent" dir="ltr">
                              {formatToman(Number(order.total))}
                           </span>
                           <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{fa.currency}</span>
                        </dd>
                     </div>
                  </dl>

                  {/* The order is paid from the wallet, always - the gateway only ever
                      tops the wallet up, so there is no card to name here. */}
                  <p className="mt-3 text-xs text-navy-500 dark:text-navy-400">{fa.panel.orders.paidFromWallet}</p>
               </div>

               {/* ---------- Delivery ---------- */}
               <div className="border-t border-border-subtle bg-navy-50/60 px-6 py-5 dark:bg-navy-900/40">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
                     <TruckIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                     {fa.panel.orders.deliveryTitle}
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-navy-600 dark:text-navy-300">{fa.panel.orders.deliveryBody}</p>

                  <Link
                     href="/panel/offers"
                     className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-xs font-bold text-navy-700 transition-colors duration-300 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-200 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
                  >
                     {fa.panel.tabs.offers}
                  </Link>
               </div>
            </div>
         </Reveal>
      </div>
   )
}
