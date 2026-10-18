"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRightIcon, PhotoIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import type { AdminOrder } from "@/app/contracts/panel"
import { orderItemImage, orderItemLabel } from "@/app/lib/orderItems"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"
import OrderStatusBadge from "@/app/components/ui/OrderStatusBadge"
import EmptyState from "@/app/components/ui/EmptyState"

const thClass =
   "px-6 py-3.5 text-start text-xs font-bold tracking-wide text-navy-600 uppercase dark:text-navy-300"

/** Persian (Jalali-friendly) short date without pulling in a date library. */
function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

/** Skin thumbnails, capped at four, plus a "+n" chip for the rest. */
function ItemThumbs({ order }: { order: AdminOrder }) {
   const visible = order.items.slice(0, 4)
   const overflow = order.items.length - visible.length

   return (
      <span className="flex items-center gap-1.5">
         {visible.map((item) => {
            const image = orderItemImage(item)
            const label = orderItemLabel(item)
            return (
               <span
                  key={item.id}
                  title={label}
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-surface-muted"
               >
                  {image ? (
                     <Image src={image} alt={label} fill sizes="36px" className={`p-1 ${item.service ? "object-cover" : "object-contain"}`} unoptimized />
                  ) : (
                     <PhotoIcon className="h-3.5 w-3.5 text-navy-300 dark:text-navy-600" aria-hidden="true" />
                  )}
               </span>
            )
         })}
         {overflow > 0 ? (
            <span className="rounded-lg bg-navy-100 px-1.5 py-1 text-[10px] font-bold text-navy-600 dark:bg-navy-800 dark:text-navy-300">
               +{overflow}
            </span>
         ) : null}
         {order.items.length === 0 ? (
            <span className="text-xs text-navy-400 dark:text-navy-500">—</span>
         ) : null}
      </span>
   )
}

interface OrdersTableProps {
   orders: AdminOrder[]
   onOpen: (order: AdminOrder) => void
}

export default function OrdersTable({ orders, onOpen }: OrdersTableProps) {
   const prefersReduced = useReducedMotion()

   if (orders.length === 0) {
      return (
         <EmptyState
            icon={<ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />}
            title={fa.admin.orders.emptyTitle}
            body={fa.admin.orders.emptyBody}
            tone="brand"
         />
      )
   }

   return (
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle">
               <thead className="bg-navy-100/70 dark:bg-navy-900/50">
                  <tr className="border-b border-border-subtle">
                     <th scope="col" className={thClass}>
                        {fa.admin.orders.headers.order}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.orders.headers.customer}
                     </th>
                     <th scope="col" className={thClass + " hidden md:table-cell"}>
                        {fa.admin.orders.headers.items}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.orders.headers.total}
                     </th>
                     <th scope="col" className={thClass + " hidden sm:table-cell"}>
                        {fa.admin.orders.headers.placedAt}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.orders.headers.status}
                     </th>
                     <th scope="col" className={thClass}>
                        <span className="sr-only">{fa.admin.orders.headers.details}</span>
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/70">
                  {orders.map((order, index) => {
                     const units = order.items.reduce((total, item) => total + Math.max(1, Number(item.quantity) || 1), 0)
                     const customer = order.user_name || order.user_email || order.user_phone || `${fa.header.fallbackUserName} #${order.user_id}`

                     return (
                        <motion.tr
                           key={order.id}
                           initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, margin: "-40px" }}
                           transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
                           className="group transition-colors duration-200 hover:bg-brand-50/60 dark:hover:bg-brand-500/[0.07]"
                        >
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-extrabold text-navy-950 dark:text-white" dir="ltr">
                                 #{order.id.toLocaleString("en-US")}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="block truncate font-semibold text-navy-950 dark:text-white">{customer}</span>
                              {order.user_phone ? (
                                 <span dir="ltr" className="text-xs text-navy-500 dark:text-navy-400">
                                    {order.user_phone}
                                 </span>
                              ) : null}
                           </td>
                           <td className="hidden px-6 py-4 md:table-cell">
                              <div className="flex items-center gap-2">
                                 <ItemThumbs order={order} />
                                 <span className="text-xs text-navy-500 dark:text-navy-400">
                                    {fa.panel.orders.itemsCount.replace("{count}", units.toLocaleString("en-US"))}
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="font-bold text-navy-950 dark:text-white" dir="ltr">
                                 {formatToman(Number(order.total))}
                              </span>
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap text-navy-500 sm:table-cell dark:text-navy-400">
                              {formatDate(order.created_at)}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <OrderStatusBadge status={order.status} />
                           </td>
                           <td className="px-6 py-4 text-end whitespace-nowrap">
                              <button
                                 type="button"
                                 onClick={() => onOpen(order)}
                                 aria-label={fa.admin.orders.detailsAria.replace("{id}", String(order.id))}
                                 className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3.5 py-2 text-xs font-bold text-navy-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-200 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
                              >
                                 {fa.admin.orders.headers.details}
                                 <ArrowUpRightIcon
                                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-300"
                                    aria-hidden="true"
                                 />
                              </button>
                           </td>
                        </motion.tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>
   )
}
