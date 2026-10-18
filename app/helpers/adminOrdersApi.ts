import type { AdminOrder, OrdersSummary, OrderStatus } from "@/app/contracts/panel"
import { getLoginToken } from "./auth"
import { API_BASE } from "@/app/lib/apiBase"

// Always send the raw JWT header expected by the backend when available.
function authHeaders(): Record<string, string> {
   const token = getLoginToken()
   return token ? { Authorization: token } : {}
}

/**
 * Client-side calls for the admin order book.
 *
 * Every failure carries the backend's machine `code` (see
 * app/services/orderAdmin.js) so the UI can answer each refusal specifically -
 * "already refunded" reads very differently from "not allowed from here".
 */
export class OrderAdminError extends Error {
   code: string
   status: number
   details: Record<string, unknown> | null

   constructor(code: string, status: number, message: string, details?: Record<string, unknown>) {
      super(message)
      this.name = "OrderAdminError"
      this.code = code
      this.status = status
      this.details = details ?? null
   }
}

async function parseFailure(res: Response): Promise<never> {
   let payload: unknown = null
   try {
      payload = await res.json()
   } catch {
      // A non-JSON error body - fall back to the status line only.
   }
   const body = (payload ?? {}) as { code?: string; message?: string; details?: Record<string, unknown> }
   throw new OrderAdminError(body.code ?? "UNKNOWN", res.status, body.message ?? `Request failed with ${res.status}`, body.details)
}

// transitionOrderStatus — PATCH /orders/:id/status (FullAcc only).
export async function transitionOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
   const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({ status }),
   })
   if (!res.ok) await parseFailure(res)
}

// getAdminOrders — the live list, used to refetch after a successful action.
export async function getAdminOrders(): Promise<{ orders: AdminOrder[]; summary: OrdersSummary }> {
   const res = await fetch(`${API_BASE}/orders/all`, {
      headers: authHeaders(),
      credentials: "include",
      cache: "no-store",
   })
   if (!res.ok) await parseFailure(res)
   const body: unknown = await res.json()
   const parsed = body as { orders?: AdminOrder[]; summary?: OrdersSummary }
   return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      summary: parsed.summary ?? { total: 0, byStatus: {} },
   }
}

// registerTradeOffer — POST /trade-offers (FullAcc only): record the offer URL
// the shop has sent for an order; the order moves to `trade_sent`.
export async function registerTradeOffer(orderId: number, steamOfferUrl: string): Promise<void> {
   const res = await fetch(`${API_BASE}/trade-offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({ order_id: orderId, steam_offer_url: steamOfferUrl }),
   })
   if (!res.ok) await parseFailure(res)
}
