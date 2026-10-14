import type { Permission } from "@/app/lib/permissions"
import { fa } from "@/app/lib/i18n/fa"

export interface AdminUser {
   id: number
   name?: string | null
   email?: string | null
   phone?: string | null
   created_at?: number | string | null
   permission?: Permission | null
}

interface UsersTableProps {
   users: AdminUser[]
}

function formatJoined(value: AdminUser["created_at"]): string {
   if (value === null || value === undefined || value === "") return "—"
   const date = new Date(typeof value === "number" ? value : String(value))
   if (Number.isNaN(date.getTime())) return "—"
   return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

const thClass = "px-6 py-3.5 text-start text-xs font-bold tracking-wide text-navy-600 uppercase dark:text-navy-300"

export default function UsersTable({ users }: UsersTableProps) {
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
                     <th scope="col" className={classNames(thClass, "hidden sm:table-cell")}>
                        {fa.admin.users.headers.joined}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.users.headers.permission}
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/70">
                  {users.map((user) => {
                     const displayName = user.name || user.email || user.phone || `${fa.header.fallbackUserName} #${user.id}`
                     const contact = user.email || user.phone || "—"
                     return (
                        <tr
                           key={user.id}
                           className="group transition-colors duration-200 hover:bg-brand-50/60 dark:hover:bg-brand-500/[0.07]"
                        >
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-x-3">
                                 <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-600 to-brand-700 p-px">
                                    <span className="flex h-full w-full items-center justify-center rounded-full bg-surface text-xs font-extrabold text-brand-700 dark:bg-navy-950 dark:text-brand-300">
                                       {displayName.slice(0, 1)}
                                    </span>
                                 </span>
                                 <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{displayName}</p>
                                    <p className="text-xs text-navy-500 dark:text-navy-400">
                                       {fa.admin.users.idLabel}: {user.id}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap text-navy-600 dark:text-navy-300">{contact}</td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap text-navy-500 sm:table-cell dark:text-navy-400">
                              {formatJoined(user.created_at)}
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="rounded-full bg-navy-100 px-2.5 py-1 font-mono text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                                 {user.permission ?? "NoAccess"}
                              </span>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>
   )
}

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}