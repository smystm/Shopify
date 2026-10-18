"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Pagination from "@/app/components/ui/Pagination"
import UsersTable from "./UsersTable"
import UsersEmptyState from "./UsersEmptyState"
import PermissionDialog from "./PermissionDialog"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminUser } from "./UsersTable"
import type { Permission } from "@/app/lib/permissions"
import { USERS_PAGE_SIZE } from "@/app/lib/users"
import { useAppSelector } from "@/app/lib/store/hooks"
import { selectPermission } from "@/app/lib/store/authSlice"
import { fa } from "@/app/lib/i18n/fa"

interface UsersClientProps {
    initialUsers: AdminUser[]
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    // Mutable because a permission change edits its row in place; the panel
    // holds the list rather than refetching, the same way the products panel does.
    const [users, setUsers] = useState<AdminUser[]>(initialUsers)
    const [editingPermission, setEditingPermission] = useState<AdminUser | null>(null)
    // Use the permission stored in Redux; useAuth refreshes it from /user.
    const permission = useAppSelector(selectPermission)
    // Only FullAcc may change another user's permission - the same rule the
    // backend enforces on PATCH /users/:id/permission.
    const isFullAcc = permission === "FullAcc"

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

    const handlePermissionSaved = (_user: AdminUser, next: Permission) => {
       const userId = editingPermission?.id
       setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, permission: next } : u)))
       setEditingPermission(null)
       toast.success(fa.admin.users.permissionSaved)
    }

    return (
      <>
          {permission === "NoAccess" ? (
            <AccessDenied />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
             <div>
                <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.admin.users.title}</h1>
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{fa.admin.users.subtitle}</p>
             </div>
             <span className="rounded-full border border-brand-500/25 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300">
                {fa.admin.users.total.replace("{count}", String(users.length))}
             </span>
          </div>

          <div className="mt-6">
             {isOutOfRange ? (
                <UsersEmptyState variant="page-out-of-range" onGoToFirstPage={() => handlePageChange(1)} />
             ) : visibleUsers.length === 0 ? (
                <UsersEmptyState variant="no-users" />
             ) : (
                <UsersTable users={visibleUsers} onEditPermission={isFullAcc ? setEditingPermission : undefined} />
             )}
          </div>

              {
                 totalPages > 1 && (
                    <Pagination
                       page={rawPage}
                       totalPages={totalPages}
                       total={users.length}
                       pageSize={USERS_PAGE_SIZE}
                       onPageChange={handlePageChange}
                    />
                 )
              }
            </>
          )}

          {editingPermission
             ? <PermissionDialog
                  user={editingPermission}
                  onClose={() => setEditingPermission(null)}
                  onSaved={handlePermissionSaved}
               />
             : null}

      </>
    )
}
