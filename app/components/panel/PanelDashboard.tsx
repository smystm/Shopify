"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
   Squares2X2Icon,
   ShoppingCartIcon,
   ClipboardDocumentListIcon,
   ShieldCheckIcon,
   ShoppingBagIcon,
   ArrowsRightLeftIcon,
   WalletIcon,
   TagIcon,
} from "@heroicons/react/24/outline"
import { getCategories } from "@/app/helpers/productApi"
import { getOrders, getTradeOffers, getWallet } from "@/app/helpers/panelApi"
import type { Order, TradeOffer } from "@/app/contracts/panel"
import type { AuthUser } from "@/app/lib/store/authSlice"
import { canViewAdmin } from "@/app/lib/permissions"
import PageHero from "@/app/components/ui/PageHero"
import Reveal from "@/app/components/ui/Reveal"
import StatCard from "@/app/components/ui/StatCard"
import QuickActionTile from "@/app/components/ui/QuickActionTile"
import OrderStatusBadge, { TradeOfferStatusBadge } from "@/app/components/ui/OrderStatusBadge"
import { AvatarTile, IdentityTitle, usePersianGreeting } from "@/app/components/panel/PanelIdentity"
import ProfileCard from "@/app/components/panel/ProfileCard"
import { fa } from "@/app/lib/i18n/fa"
import { orderItemImage, orderItemLabel } from "@/app/lib/orderItems"

interface PanelDashboardProps {
   /** Read from the `shopy-user` cookie on the server, so there is no empty flash. */
   user: AuthUser | null
}

function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

export default function PanelDashboard({ user }: PanelDashboardProps) {
   const greeting = usePersianGreeting()

   /* `null` means "not resolved yet" and keeps StatCard on its placeholder.
      A genuine zero is a real number and renders as 0. */
   const [orders, setOrders] = useState<Order[] | null>(null)
   const [balance, setBalance] = useState<number | null>(null)
   const [pendingOffers, setPendingOffers] = useState<TradeOffer[] | null>(null)
   const [categoryCount, setCategoryCount] = useState<number | null>(null)

   useEffect(() => {
      let cancelled = false

      // allSettled so one failing endpoint cannot blank out the whole overview.
      Promise.allSettled([getOrders(), getWallet(), getTradeOffers(), getCategories()]).then(
         ([orderResult, walletResult, offerResult, categoryResult]) => {
            if (cancelled) return
            if (orderResult.status === "fulfilled") setOrders(orderResult.value.orders)
            else setOrders([])

            if (walletResult.status === "fulfilled") setBalance(walletResult.value.balance)
            else setBalance(0)

            if (offerResult.status === "fulfilled") {
               setPendingOffers(offerResult.value.incoming.filter((o) => o.status === "pending"))
            } else setPendingOffers([])

            if (categoryResult.status === "fulfilled") setCategoryCount(categoryResult.value.length)
            else setCategoryCount(0)
         }
      )

      return () => {
         cancelled = true
      }
   }, [])

   const permission = user?.permission ?? null
   const roleLabel = permission ? fa.panel.roles[permission] : fa.panel.roles.NoAccess
   const adminAllowed = canViewAdmin(permission)
   const displayName = user?.name || user?.phone || fa.header.fallbackUserName

   const orderList = orders ?? []
   const offerList = pendingOffers ?? []
   const activeOrders = orderList.filter(
      (o) => o.status === "pending_payment" || o.status === "in_escrow" || o.status === "trade_sent"
   )

   return (
      <div>
         {/* Identity only — no badge, no blurb. The role speaks for itself. */}
         <PageHero
            title={<IdentityTitle greeting={greeting} name={displayName} roleLabel={roleLabel} elevated={adminAllowed} />}
            leading={<AvatarTile name={displayName} />}
         />

         {/* ---------- At a glance ---------- */}
         <section className="mt-10">
            <Reveal delay={0.08}>
               <h2 className="text-lg font-bold text-navy-950 dark:text-white">{fa.panel.stats.title}</h2>
               <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{fa.panel.stats.subtitle}</p>
            </Reveal>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
               <Reveal delay={0.12}>
                  <StatCard
                     icon={<ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />}
                     value={orders === null ? null : orderList.length}
                     label={fa.panel.stats.ordersLabel}
                     hint={fa.panel.stats.ordersHint}
                  />
               </Reveal>
               <Reveal delay={0.18}>
                  <StatCard
                     icon={<WalletIcon className="h-5 w-5" aria-hidden="true" />}
                     value={balance}
                     label={fa.panel.stats.balanceLabel}
                     hint={fa.panel.stats.balanceHint}
                  />
               </Reveal>
               <Reveal delay={0.24}>
                  <StatCard
                     icon={<ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />}
                     value={pendingOffers === null ? null : offerList.length}
                     label={fa.panel.stats.offersLabel}
                     hint={fa.panel.stats.offersHint}
                  />
               </Reveal>
               <Reveal delay={0.3}>
                  <StatCard
                     icon={<TagIcon className="h-5 w-5" aria-hidden="true" />}
                     value={categoryCount}
                     label={fa.panel.stats.categoriesLabel}
                     hint={fa.panel.stats.categoriesHint}
                  />
               </Reveal>
            </div>
         </section>

         {/* ---------- Active orders + trade offers ---------- */}
         <section className="mt-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
               <div className="lg:col-span-3">
                  <Reveal delay={0.08}>
                     <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-navy-950 dark:text-white">{fa.panel.orders.title}</h2>
                        <Link
                           href="/panel/orders"
                           className="text-sm font-bold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
                        >
                           {fa.panel.orders.allStatuses}
                        </Link>
                     </div>
                  </Reveal>

                  {orders === null ? (
                     <div className="mt-4 space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                           <div key={i} className="h-[74px] animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
                        ))}
                     </div>
                  ) : activeOrders.length === 0 ? (
                     <Reveal delay={0.12}>
                        <div className="mt-4 rounded-2xl border border-dashed border-navy-300 bg-surface px-5 py-10 text-center dark:border-navy-700">
                           <p className="text-sm leading-6 text-navy-600 dark:text-navy-300">{fa.panel.orders.emptyBody}</p>
                           <Link
                              href="/products"
                              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40"
                           >
                              {fa.panel.orders.emptyCta}
                              <Squares2X2Icon className="h-4 w-4" aria-hidden="true" />
                           </Link>
                        </div>
                     </Reveal>
                  ) : (
                     <div className="mt-4 space-y-3">
                        {activeOrders.slice(0, 3).map((order) => {
                           // A service line has no product title, so the preview reads
                           // through the same resolver the order's own page uses.
                           const first = order.items[0]
                           const label = first ? orderItemLabel(first) : `#${order.id}`
                           const image = first ? orderItemImage(first) : null

                           return (
                              <Link
                                 key={order.id}
                                 href={`/panel/orders/${order.id}`}
                                 className="group flex items-center gap-4 rounded-2xl border border-border-strong bg-surface p-4 shadow-md shadow-navy-900/5 transition-all duration-300 hover:border-brand-400 hover:shadow-lg hover:shadow-brand-500/10"
                              >
                                 <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-muted">
                                    {image ? (
                                       <Image
                                          src={image}
                                          alt=""
                                          fill
                                          sizes="56px"
                                          className={`p-2 ${first?.service ? "object-cover" : "object-contain"}`}
                                          unoptimized
                                       />
                                    ) : (
                                       <ShoppingBagIcon className="h-6 w-6 text-navy-400" aria-hidden="true" />
                                    )}
                                 </span>
                                 <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-bold text-navy-950 dark:text-white">
                                       {label || `#${order.id}`}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-navy-500 dark:text-navy-400">
                                       {formatDate(order.created_at)}
                                    </span>
                                 </span>
                                 <OrderStatusBadge status={order.status} className="shrink-0" />
                              </Link>
                           )
                        })}
                     </div>
                  )}
               </div>

               <div className="lg:col-span-2">
                  <Reveal delay={0.14}>
                     <h2 className="text-lg font-bold text-navy-950 dark:text-white">{fa.panel.offers.title}</h2>
                  </Reveal>

                  {pendingOffers === null ? (
                     <div className="mt-4 space-y-3">
                        <div className="h-[74px] animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
                     </div>
                  ) : offerList.length === 0 ? (
                     <Reveal delay={0.18}>
                        <div className="mt-4 rounded-2xl border border-dashed border-navy-300 bg-surface px-5 py-10 text-center dark:border-navy-700">
                           <p className="text-sm leading-6 text-navy-600 dark:text-navy-300">{fa.panel.offers.emptyBody}</p>
                        </div>
                     </Reveal>
                  ) : (
                     <div className="mt-4 space-y-3">
                        {offerList.map((offer) => (
                           <Link
                              key={offer.id}
                              href="/panel/offers"
                              className="group flex items-center gap-3 rounded-2xl border border-accent-500/30 bg-accent-500/8 p-4 transition-all duration-300 hover:border-accent-500/60"
                           >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-700 text-white shadow-lg shadow-accent-800/25">
                                 <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                              <span className="min-w-0 flex-1">
                                 <span className="block text-sm font-bold text-navy-950 dark:text-white">
                                    {fa.panel.offers.directionIncoming}
                                 </span>
                                 <span className="mt-0.5 block text-xs text-navy-600 dark:text-navy-400">
                                    {formatDate(offer.created_at)}
                                 </span>
                              </span>
                              <TradeOfferStatusBadge status={offer.status} className="shrink-0" />
                           </Link>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* ---------- Quick actions ---------- */}
         <section className="mt-10">
            <Reveal delay={0.08}>
               <h2 className="text-lg font-bold text-navy-950 dark:text-white">{fa.panel.actions.title}</h2>
               <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{fa.panel.actions.subtitle}</p>
            </Reveal>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
               <Reveal delay={0.12}>
                  <QuickActionTile
                     icon={<Squares2X2Icon className="h-6 w-6" aria-hidden="true" />}
                     title={fa.panel.actions.browse.title}
                     body={fa.panel.actions.browse.body}
                     cta={fa.panel.actions.browse.cta}
                     href="/products"
                  />
               </Reveal>

               {/* The admin tile is hidden entirely without permission rather
                   than shown disabled — a customer has no use for it. */}
               {adminAllowed ? (
                  <Reveal delay={0.2}>
                     <QuickActionTile
                        icon={<ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />}
                        title={fa.panel.actions.admin.title}
                        body={fa.panel.actions.admin.bodyAllowed}
                        cta={fa.panel.actions.admin.ctaAllowed}
                        href="/admin"
                     />
                  </Reveal>
               ) : null}

               <Reveal delay={0.28}>
                  <QuickActionTile
                     icon={<ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />}
                     title={fa.panel.actions.cart.title}
                     body={fa.panel.actions.cart.body}
                     cta={fa.panel.actions.cart.cta}
                     href="/cart"
                  />
               </Reveal>

               <Reveal delay={0.36}>
                  <QuickActionTile
                     icon={<ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />}
                     title={fa.panel.actions.orders.title}
                     body={fa.panel.actions.orders.body}
                     cta={fa.panel.actions.orders.cta}
                     href="/panel/orders"
                  />
               </Reveal>
            </div>
         </section>

         {/* ---------- Profile ---------- */}
         <div className="mt-10">
            <ProfileCard user={user} permissionLabel={roleLabel} />
         </div>
      </div>
   )
}