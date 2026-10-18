import type { Permission } from "@/app/lib/permissions"
import { getLoginToken } from "./auth"
import { API_BASE } from "@/app/lib/apiBase"

// Always send the raw JWT header expected by the backend when available.
function authHeaders(): Record<string, string> {
   const token = getLoginToken()
   return token ? { Authorization: token } : {}
}

// setUserPermission — FullAcc-only PATCH /users/:id/permission.
export async function setUserPermission(id: number, permission: Permission): Promise<void> {
   const res = await fetch(`${API_BASE}/users/${id}/permission`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({ permission }),
   })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`PATCH /users/${id}/permission failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
}
