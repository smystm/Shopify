"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { toast } from "react-toastify"
import OrdersTable from "./OrdersTable"
import OrderDetailDialog from "./OrderDetailDialog"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminOrder, OrderStatus, OrdersSummary } from "@/app/contracts/panel"
import { ORDER_STATUSES } from "@/app/contracts/panel"
import { getAdminOrders } from "@/app/helpers/adminOrdersApi"
import { useAppSelector } from "@/app/lib/store/hooks"
import { selectPermission } from "@/app/lib/store/authSlice"
import { fa } from "@/app/lib/i18n/fa"

interface OrdersClientProps {
   initialOrders: AdminOrder[]
   initialSummary: OrdersSummary
}

/** The action-stat tiles are statuses an operator must act on, not raw fields. */
function tileCounts(summary: OrdersSummary) {
   const by = summary.byStatus ?? {}
   const copy = fa.admin.orders.summary
   return [
      {
         key: "awaiting",
         label: copy.awaiting,
         hint: copy.awaitingHint,
         count: (by.pending_payment ?? 0) + (by.in_escrow ?? 0),
         tone: "text-accent-700 dark:text-accent-300",
      },
      {
         key: "tradeSent",
         label: copy.tradeSent,
         hint: copy.tradeSentHint,
         count: by.trade_sent ?? 0,
         tone: "text-navy-900 dark:text-white",
      },
      {
         key: "delivered",
         label: copy.delivered,
         hint: copy.deliveredHint,
         count: by.completed ?? 0,
         tone: "text-emerald-700 dark:text-emerald-300",
      },
      {
         key: "disputed",
         label: copy.disputed,
         hint: copy.disputedHint,
         count: by.disputed ?? 0,
         tone: "text-red-700 dark:text-red-300",
      },
   ] as const
}

export default function OrdersClient({ initialOrders, initialSummary }: OrdersClientProps) {
   const prefersReduced = useReducedMotion()
   const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)
   const [summary, setSummary] = useState<OrdersSummary>(initialSummary)
   const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
   const [selectedId, setSelectedId] = useState<number | null>(null)
   const [refreshing, setRefreshing] = useState(false)
   // Use the permission stored in Redux; useAuth refreshes it from /user.
   const permission = useAppSelector(selectPermission)
   // FullAcc matches the backend: viewing the book is possible for everyone
   // past NoAccess, but moving an order out of its status is FullAcc only.
   const canManage = permission === "FullAcc"

   const refetch = async () => {
      setRefreshing(true)
      try {
         const { orders: nextOrders, summary: nextSummary } = await getAdminOrders()
         setOrders(nextOrders)
         setSummary(nextSummary)
      } catch {
         toast.error(fa.admin.orders.toast.loadFailed)
      } finally {
         setRefreshing(false)
      }
   }

   const filtered = useMemo(
      () => (statusFilter ? orders.filter((order) => order.status === statusFilter) : orders),
      [orders, statusFilter],
   )

   const selectedOrder = orders.find((order) => order.id === selectedId) ?? null
   const tiles = tileCounts(summary)

   // One chip per status the book has actually seen, plus "all", so a status
   // with no orders never offers an empty state.
   const presentStatuses = ORDER_STATUSES.filter(
      (status) => (summary.byStatus?.[status] ?? 0) > 0,
   )

   return (
      <>
         {permission === "NoAccess" ? (
            <AccessDenied />
         ) : (
            <>
               <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                     <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.admin.orders.title}</h1>
                     <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{fa.admin.orders.subtitle}</p>
                  </div>
                  <span className="flex items-center gap-2">
                     {refreshing ? (
                        <span className="text-xs font-semibold text-navy-500 dark:text-navy-400">
                           {fa.admin.orders.loadingTitle}
                        </span>
                     ) : null}
                     <span className="rounded-full border border-brand-500/25 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300">
                        {fa.admin.orders.total.replace("{count}", String(orders.length))}
                     </span>
                  </span>
               </div>

               {/* ---------- Action stats ---------- */}
               <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {tiles.map((tile, index) => (
                     <motion.div
                        key={tile.key}
                        initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="group rounded-2xl border border-border-strong bg-surface p-4 shadow-sm shadow-navy-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-500/10"
                     >
                        <p className="text-xs font-bold text-navy-600 dark:text-navy-300">
                           {tile.label}
                        </p>
                        <p className="mt-2 flex items-baseline gap-1.5">
                           <span className={`text-2xl font-extrabold tracking-tight ${tile.tone}`} dir="ltr">
                              {tile.count.toLocaleString("en-US")}
                           </span>
                        </p>
                        <p className="mt-1.5 text-[11px] leading-5 text-navy-500 dark:text-navy-400">
                           {tile.hint}
                        </p>
                     </motion.div>
                  ))}
               </div>

               {/* ---------- Status chips ---------- */}
               {presentStatuses.length > 0 ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                     <button
                        type="button"
                        onClick={() => setStatusFilter(null)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                           statusFilter === null
                              ? "border-brand-500/40 bg-brand-500/12 text-brand-800 dark:text-brand-200"
                              : "border-border-subtle text-navy-600 hover:border-brand-400/60 hover:text-brand-700 dark:text-navy-300"
                        }`}
                     >
                        {fa.panel.orders.allStatuses}
                     </button>
                     {presentStatuses.map((status) => {
                        const selected = statusFilter === status
                        return (
                           <button
                              key={status}
                              type="button"
                              onClick={() => setStatusFilter(selected ? null : status)}
                              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                                 selected
                                    ? "border-brand-500/40 bg-brand-500/12 text-brand-800 dark:text-brand-200"
                                    : "border-border-subtle text-navy-600 hover:border-brand-400/60 hover:text-brand-700 dark:text-navy-300"
                              }`}
                           >
                              {fa.panel.orderStatus[status]}
                              <span className="ms-1.5 text-[10px] font-extrabold opacity-70" dir="ltr">
                                 {(summary.byStatus?.[status] ?? 0).toLocaleString("en-US")}
                              </span>
                           </button>
                        )
                     })}
                  </div>
               ) : null}

               {/* ---------- The book ---------- */}
               <div className="mt-4">
                  <OrdersTable orders={filtered} onOpen={(order) => setSelectedId(order.id)} />
               </div>
            </>
         )}

         {selectedOrder ? (
            <OrderDetailDialog
               order={selectedOrder}
               canManage={canManage}
               onClose={() => setSelectedId(null)}
               onChanged={() => {
                  // Refetch first so the dialog's own order prop is already the
                  // post-action one before it re-renders.
                  void refetch()
               }}
            />
         ) : null}
      </>
   )
}
