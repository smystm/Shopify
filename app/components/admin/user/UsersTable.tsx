export interface AdminUser {
   id: number
   name?: string | null
   email?: string | null
   phone?: string | null
   created_at?: number | string | null
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

export default function UsersTable({ users }: UsersTableProps) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
               <thead className="bg-zinc-50 dark:bg-zinc-900/60">
                  <tr>
                     <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                     >
                        User
                     </th>
                     <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                     >
                        Contact
                     </th>
                     <th
                        scope="col"
                        className="hidden px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase sm:table-cell dark:text-zinc-400"
                     >
                        Joined
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {users.map((user) => {
                     const displayName = user.name || user.email || user.phone || `User #${user.id}`
                     const contact = user.email || user.phone || "—"
                     return (
                        <tr key={user.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-x-3">
                                 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white uppercase dark:bg-white dark:text-zinc-950">
                                    {displayName.slice(0, 1)}
                                 </span>
                                 <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                                       {displayName}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {user.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                              {contact}
                           </td>
                           <td className="hidden px-6 py-4 text-sm whitespace-nowrap text-zinc-500 sm:table-cell dark:text-zinc-400">
                              {formatJoined(user.created_at)}
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
