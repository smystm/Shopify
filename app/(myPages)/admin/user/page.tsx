import { cookies } from "next/headers"
import UsersClient from "@/app/components/admin/user/UsersClient"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminUser } from "@/app/components/admin/user/UsersTable"
import { getCurrentUser } from "@/app/helpers/getCurrentUser"
import { canViewAdmin } from "@/app/lib/permissions"
import type { AuthUser } from "@/app/lib/store/authSlice"

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

async function getUsers(token: string): Promise<AdminUser[]> {
   if (!token) throw new Error("missing shopy-token cookie (not logged in)")
   const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: token },
      cache: "no-store",
   })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`GET /users failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
   const body: unknown = await res.json()
   if (typeof body === "object" && body !== null && Array.isArray((body as { users?: unknown }).users)) {
      return (body as { users: AdminUser[] }).users
   }
   return []
}

export default async function AdminUsersPage() {
   const token = (await cookies()).get("shopy-token")?.value ?? ""

   let users: AdminUser[] = []
   let loadError: string | null = null
   let currentUser: AuthUser | null = null
   try {
      // Check the user's permission before loading admin data.
      currentUser = await getCurrentUser(token)
      if (currentUser && canViewAdmin(currentUser.permission)) {
         users = await getUsers(token)
      }
   } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      loadError = `Could not load users from the API (${reason}). Make sure the phone-auth backend (back-authWithPhone) is running on :5000 with the protected GET /api/users endpoint, and that you are logged in with a fresh phone-verified token.`
   }

   if (loadError) {
      return (
         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Couldn&apos;t load users</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-red-600/90 dark:text-red-400/90">{loadError}</p>
         </div>
      )
   }

   if (!currentUser || !canViewAdmin(currentUser.permission)) {
      return <AccessDenied />
   }

   return <UsersClient initialUsers={users} />
}
