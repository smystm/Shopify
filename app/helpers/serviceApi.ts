import type { ServiceName, ServicePrice } from "@/app/contracts/services"
import { getLoginToken } from "./auth"

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

// Always send the raw JWT header expected by the backend when available.
function authHeaders(token?: string): Record<string, string> {
   const resolvedToken = token ?? getLoginToken()
   return resolvedToken ? { Authorization: resolvedToken } : {}
}

/**
 * getServicePrices — prices for the non-skin goods (CS2 Prime, TF2 keys).
 *
 * `no-store` for the same reason the catalogue uses it: these are storefront
 * prices and a cached price is a wrong price. The abort timeout keeps a dead
 * backend from hanging a server render.
 */
async function getServicePrices(service?: ServiceName, token?: string): Promise<ServicePrice[]> {
   const query = service ? `?service=${encodeURIComponent(service)}` : ""
   const controller = new AbortController()
   const timeout = setTimeout(() => controller.abort(), 5000)

   const res = await fetch(`${API_BASE}/services${query}`, {
      headers: authHeaders(token),
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
   })
   clearTimeout(timeout)

   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`GET /services failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }

   const body: unknown = await res.json()
   if (typeof body === "object" && body !== null && Array.isArray((body as { prices?: unknown }).prices)) {
      return (body as { prices: ServicePrice[] }).prices
   }

   return []
}

export { getServicePrices }
