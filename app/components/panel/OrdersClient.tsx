"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import type { Order, OrderStatus } from "@/app/contracts/panel"
import { ORDER_STATUSES } from "@/app/contracts/panel"
import { getOrders } from "@/app/helpers/panelApi"
import OrderStatusBadge from "@/app/components/ui/OrderStatusBadge"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"

/** Persian (Jalali-friendly) short date without pulling in a date library. */
function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

export default function OrdersClient() {
   const prefersReduced = useReducedMotion()
   const [orders, setOrders] = useState<Order[]>([])
   const [loading, setLoading] = useState(true)
   const [filter, setFilter] = useState<OrderStatus | "all">("all")

   useEffect(() => {
      let cancelled = false

      getOrders()
         .then((res) => {
            if (!cancelled) setOrders(res.orders)
         })
         .catch(() => {
            if (!cancelled) setOrders([])
         })
         .finally(() => {
            if (!cancelled) setLoading(false)
         })

      return () => {
         cancelled = true
      }
   }, [])

   const visible = useMemo(() => (filter === "all" ? orders : orders.filter((o) => o.status === filter)), [orders, filter])

   // Only offer filters the customer actually has orders in.
   const availableStatuses = useMemo(() => ORDER_STATUSES.filter((s) => orders.some((o) => o.status === s)), [orders])

   if (loading) {
      return (
         <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="overflow-hidden rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
                  <div className="flex items-center justify-between gap-4">
                     <div className="h-4 w-32 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                     <div className="h-6 w-24 animate-pulse rounded-full bg-navy-200 dark:bg-navy-800" />
                  </div>
                  <div className="mt-5 flex gap-3">
                     {Array.from({ length: 3 }).map((__, j) => (
                        <div key={j} className="h-16 w-16 animate-pulse rounded-xl bg-navy-200 dark:bg-navy-800" />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      )
   }

   return (
      <div>
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{fa.panel.orders.title}</h1>
            <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{fa.panel.orders.subtitle}</p>
         </Reveal>

         {/* Status filter */}
         {availableStatuses.length > 1 ? (
            <div className="mt-6 flex flex-wrap gap-2">
               <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                  {fa.panel.orders.allStatuses}
                  <span className="ms-1.5 text-navy-500 dark:text-navy-400">({orders.length.toLocaleString("fa-IR")})</span>
               </FilterChip>
               {availableStatuses.map((status) => (
                  <FilterChip key={status} active={filter === status} onClick={() => setFilter(status)}>
                     {fa.panel.orderStatus[status]}
                     <span className="ms-1.5 text-navy-500 dark:text-navy-400">
                        ({orders.filter((o) => o.status === status).length.toLocaleString("fa-IR")})
                     </span>
                  </FilterChip>
               ))}
            </div>
         ) : null}

         {orders.length === 0 ? (
            <div className="mt-8">
               <EmptyState
                  icon={<ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />}
                  title={fa.panel.orders.emptyTitle}
                  body={fa.panel.orders.emptyBody}
                  tone="brand"
               />
            </div>
         ) : visible.length === 0 ? (
            <p className="mt-8 text-sm text-navy-600 dark:text-navy-300">{fa.panel.orders.emptyBody}</p>
         ) : (
            <div className="mt-6 space-y-4">
               {visible.map((order, i) => (
                  <motion.article
                     key={order.id}
                     initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-60px" }}
                     transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                     className="group relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5 transition-all duration-300 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10"
                  >
                     <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-e-16 -top-16 h-40 w-40 rounded-full bg-brand-400/12 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                     />

                     <div className="relative flex flex-wrap items-start justify-between gap-4">
                        <div>
                           <p className="text-xs font-medium text-navy-500 dark:text-navy-400">
                              {fa.panel.orders.orderNumber} #{order.id.toLocaleString("fa-IR")}
                           </p>
                           <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
                              {fa.panel.orders.placedAt}: {formatDate(order.created_at)}
                           </p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                     </div>

                     {/* Item snapshots */}
                     {order.items.length > 0 ? (
                        <div className="relative mt-5 flex flex-wrap items-center gap-3">
                           {order.items.map((item) => (
                              <span
                                 key={item.id}
                                 title={item.title}
                                 className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-muted"
                              >
                                 {item.image ? (
                                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-contain p-2" unoptimized />
                                 ) : (
                                    <span className="px-1 text-center text-[10px] text-navy-500">{item.title}</span>
                                 )}
                              </span>
                           ))}
                           <span className="ms-1 text-sm text-navy-500 dark:text-navy-400">
                              {fa.panel.orders.itemsCount.replace("{count}", order.items.length.toLocaleString("fa-IR"))}
                           </span>
                        </div>
                     ) : null}

                     <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
                        <span className="text-sm text-navy-600 dark:text-navy-300">{fa.panel.orders.total}</span>
                        <span className="bg-gradient-to-l from-brand-800 to-brand-700 bg-clip-text text-lg font-extrabold text-transparent" dir="ltr">
                           {formatToman(Number(order.total))}
                        </span>
                     </div>
                  </motion.article>
               ))}
            </div>
         )}
      </div>
   )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-pressed={active}
         className={[
            "rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            active
               ? "border-transparent bg-linear-to-l from-brand-700 to-brand-800 text-white shadow-md shadow-brand-700/25"
               : "border-border-strong bg-surface text-navy-700 hover:border-brand-400 hover:text-brand-700 dark:text-navy-200 dark:hover:text-brand-300",
         ].join(" ")}
      >
         {children}
      </button>
   )
}