import type { AuthUser } from "@/app/lib/store/authSlice"

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

// Fetches the logged-in user's id and permission from the backend.
export async function getCurrentUser(token: string): Promise<AuthUser | null> {
   if (!token) return null

   const res = await fetch(`${API_BASE}/user`, {
      headers: { Authorization: token },
      credentials: "include",
      cache: "no-store",
   })

   if (res.status === 401 || res.status === 403) return null

   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`GET /user failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }

   const body = await res.json()
   return body?.user ? (body.user as AuthUser) : null
}
