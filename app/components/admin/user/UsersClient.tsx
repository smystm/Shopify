"use client"

import { useMemo, useState } from "react"
import UsersPagination from "./UsersPagination"
import UsersTable from "./UsersTable"
import type { AdminUser } from "./UsersTable"
import { USERS_PAGE_SIZE } from "@/app/lib/users"

interface UsersClientProps {
   initialUsers: AdminUser[]
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
   const [users] = useState<AdminUser[]>(initialUsers)
   const [page, setPage] = useState(1)

   const totalPages = Math.max(1, Math.ceil(users.length / USERS_PAGE_SIZE))
   const safePage = Math.min(Math.max(1, page), totalPages)

   const visibleUsers = useMemo(
      () => users.slice((safePage - 1) * USERS_PAGE_SIZE, safePage * USERS_PAGE_SIZE),
      [users, safePage],
   )

   return (
      <>
         <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
               <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Users</h1>
               <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Everyone registered on your store.</p>
            </div>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
               {users.length} total
            </span>
         </div>

         <div className="mt-6">
            <UsersTable users={visibleUsers} />
         </div>

         <UsersPagination
            page={safePage}
            totalPages={totalPages}
            total={users.length}
            pageSize={USERS_PAGE_SIZE}
            onPageChange={setPage}
         />
      </>
   )
}
