"use client"

import Image from "next/image"
import { LinkIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import type { Permission } from "@/app/lib/permissions"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Every field the backend's user-management projection carries. `token` is
 * deliberately absent - it is a live session credential, not a profile field -
 * and `balance` is the same derived ledger figure the wallet page shows.
 */
export interface AdminUser {
   id: number
   name?: string | null
   email?: string | null
   phone?: string | null
   steam_id?: string | null
   trade_url?: string | null
   avatar?: string | null
   created_at?: number | string | null
   loggedin_at?: number | string | null
   permission?: Permission | null
   balance?: number | null
}

/** The tone each permission level is drawn in, lighter than a status badge. */
const PERMISSION_TONES: Record<Permission, string> = {
   FullAcc: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
   WriteDeleteEditSelfAdds: "bg-brand-500/15 text-brand-700 dark:text-brand-300",
   ReadOnly: "bg-navy-500/15 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200",
   NoAccess: "bg-accent-500/15 text-accent-800 dark:text-accent-300",
}

/** Persian label per level — the same map the customer panel's identity card uses. */
function permissionLabel(permission: Permission): string {
   return fa.panel.roles[permission] ?? permission
}

interface UsersTableProps {
   users: AdminUser[]
   /** Present only for FullAcc viewers, whose panel is allowed to change permissions. */
   onEditPermission?: (user: AdminUser) => void
}

function formatDateTime(value: AdminUser["created_at"]): string {
   if (value === null || value === undefined || value === "") return "—"
   const date = new Date(typeof value === "number" ? value : String(value))
   if (Number.isNaN(date.getTime())) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(date)
}

const thClass = "px-6 py-3.5 text-start text-xs font-bold tracking-wide text-navy-600 uppercase dark:text-navy-300"

export default function UsersTable({ users, onEditPermission }: UsersTableProps) {
   const prefersReduced = useReducedMotion()
   const canEdit = Boolean(onEditPermission)

   return (
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle">
               <thead className="bg-navy-100/70 dark:bg-navy-900/50">
                  <tr className="border-b border-border-subtle">
                     <th scope="col" className={thClass}>
                        {fa.admin.users.headers.user}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.users.headers.contact}
                     </th>
                     <th scope="col" className={thClass + " hidden md:table-cell"}>
                        {fa.admin.users.headers.steam}
                     </th>
                     <th scope="col" className={thClass + " hidden xl:table-cell"}>
                        {fa.admin.users.headers.tradeLink}
                     </th>
                     <th scope="col" className={thClass + " hidden sm:table-cell"}>
                        {fa.admin.users.headers.joined}
                     </th>
                     <th scope="col" className={thClass + " hidden lg:table-cell"}>
                        {fa.admin.users.headers.lastLogin}
                     </th>
                     <th scope="col" className={thClass + " hidden xl:table-cell"}>
                        {fa.admin.users.headers.balance}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.users.headers.permission}
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/70">
                  {users.map((user, index) => {
                     const displayName = user.name || user.email || user.phone || `${fa.header.fallbackUserName} #${user.id}`
                     const permission = user.permission ?? "NoAccess"

                     return (
                        <motion.tr
                           key={user.id}
                           initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, margin: "-40px" }}
                           transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
                           className="group transition-colors duration-200 hover:bg-brand-50/60 dark:hover:bg-brand-500/[0.07]"
                        >
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-x-3">
                                 <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-600 to-brand-700 p-px">
                                    {user.avatar ? (
                                       <Image
                                          src={user.avatar}
                                          alt=""
                                          fill
                                          sizes="36px"
                                          className="rounded-full object-cover"
                                          unoptimized
                                       />
                                    ) : (
                                       <span className="flex h-full w-full items-center justify-center rounded-full bg-surface text-xs font-extrabold text-brand-700 dark:bg-navy-950 dark:text-brand-300">
                                          {displayName.slice(0, 1)}
                                       </span>
                                    )}
                                 </span>
                                 <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{displayName}</p>
                                    <p className="text-xs text-navy-500 dark:text-navy-400">
                                       {fa.admin.users.idLabel}: {user.id.toLocaleString("en-US")}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap text-navy-600 dark:text-navy-300">
                              <div className="flex flex-col gap-0.5">
                                 <span dir="ltr" className="truncate">
                                    {user.email || "—"}
                                 </span>
                                 <span dir="ltr" className="text-xs text-navy-500 dark:text-navy-400">
                                    {user.phone || "—"}
                                 </span>
                              </div>
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap md:table-cell">
                              {user.steam_id ? (
                                 <span
                                    title={user.steam_id}
                                    dir="ltr"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/12 px-2.5 py-1 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                                 >
                                    <UserCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                    {user.steam_id.slice(0, 8)}…
                                 </span>
                              ) : (
                                 <span className="text-xs text-navy-400 dark:text-navy-500">—</span>
                              )}
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap xl:table-cell">
                              {user.trade_url ? (
                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/12 px-2.5 py-1 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                                    <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                    {fa.admin.users.tradeUrlPresent}
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-400/15 px-2.5 py-1 text-[11px] font-semibold text-navy-600 dark:text-navy-300">
                                    <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                    {fa.admin.users.tradeUrlMissing}
                                 </span>
                              )}
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap text-navy-500 sm:table-cell dark:text-navy-400">
                              {formatDateTime(user.created_at)}
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap text-navy-500 lg:table-cell dark:text-navy-400">
                              {formatDateTime(user.loggedin_at)}
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap lg:table-cell">
                              {/* Toman, Latin digits with separators — the shop's standing rule. */}
                              <span dir="ltr" className="font-semibold text-navy-700 dark:text-navy-200">
                                 {Number(user.balance ?? 0).toLocaleString("en-US")}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                 <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${PERMISSION_TONES[permission]}`}>
                                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {permissionLabel(permission)}
                                 </span>
                                 {canEdit ? (
                                    <button
                                       type="button"
                                       onClick={() => onEditPermission?.(user)}
                                       aria-label={fa.admin.users.editPermissionAria.replace("{name}", displayName)}
                                       className="inline-flex items-center rounded-lg p-1.5 text-navy-300 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-brand-500/12 hover:text-brand-700 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-600 dark:hover:text-brand-300"
                                    >
                                       <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                 ) : null}
                              </div>
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
