"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AdminPagination from "@/app/components/admin/AdminPagination"
import UsersTable from "./UsersTable"
import UsersEmptyState from "./UsersEmptyState"
import type { AdminUser } from "./UsersTable"
import { USERS_PAGE_SIZE } from "@/app/lib/users"

interface UsersClientProps {
    initialUsers: AdminUser[]
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [users] = useState<AdminUser[]>(initialUsers)

    const pageParam = searchParams.get("page")
    const rawPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

    const totalPages = Math.max(1, Math.ceil(users.length / USERS_PAGE_SIZE))
    const isOutOfRange = rawPage > totalPages
    const safePage = Math.min(rawPage, totalPages)

    const visibleUsers = useMemo(
       () => users.slice((safePage - 1) * USERS_PAGE_SIZE, safePage * USERS_PAGE_SIZE),
       [users, safePage],
    )

    const handlePageChange = (newPage: number) => {
       const params = new URLSearchParams(searchParams.toString())
       params.set("page", String(newPage))
       router.push(`?${params.toString()}`, { scroll: false })
    }

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
             {isOutOfRange ? (
                <UsersEmptyState variant="page-out-of-range" onGoToFirstPage={() => handlePageChange(1)} />
             ) : visibleUsers.length === 0 ? (
                <UsersEmptyState variant="no-users" />
             ) : (
                <UsersTable users={visibleUsers} />
             )}
          </div>

          {
             totalPages > 1 && (
                <AdminPagination
                   page={rawPage}
                   totalPages={totalPages}
                   total={users.length}
                   pageSize={USERS_PAGE_SIZE}
                   onPageChange={handlePageChange}
                />
             )
          }

      </>
    )
}
