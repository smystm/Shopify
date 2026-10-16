import type {
   EditableProfile,
   InventoryItem,
   Order,
   OrdersSummary,
   PanelProfile,
   PaymentConfig,
   PhoneChangeRequested,
   TradeOffer,
   TradeOfferStatus,
   WalletTransaction,
   WishlistItem,
} from "@/app/contracts/panel"
import { getLoginToken } from "./auth"

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

// Always send the raw JWT header the backend expects, when we have one.
function authHeaders(): Record<string, string> {
   const token = getLoginToken()
   return token ? { Authorization: token } : {}
}

async function request(path: string, init?: RequestInit): Promise<Response> {
   const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
         "Content-Type": "application/json",
         ...authHeaders(),
         ...(init?.headers ?? {}),
      },
      credentials: "include",
      cache: "no-store",
   })

   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`${init?.method ?? "GET"} ${path} failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }

   return res
}

/* ------------------------------------------------------------------ profile */

/** GET /user — the signed-in profile plus the derived wallet balance. */
async function getProfile(): Promise<PanelProfile | null> {
   const res = await request("/user")
   const body = (await res.json()) as { user?: PanelProfile }
   return body?.user ?? null
}

/** PATCH /user — edits only name / email / steam_id / trade_url. */
async function updateProfile(patch: EditableProfile): Promise<PanelProfile | null> {
   const res = await request("/user", { method: "PATCH", body: JSON.stringify(patch) })
   const body = (await res.json()) as { user?: PanelProfile }
   return body?.user ?? null
}

/**
 * Start a verified phone change. The phone number cannot be set through
 * updateProfile — it is absent from the server's whitelist on purpose.
 */
async function requestPhoneChange(phone: string): Promise<PhoneChangeRequested> {
   const res = await request("/user/phone-change/request", { method: "POST", body: JSON.stringify({ phone }) })
   return (await res.json()) as PhoneChangeRequested
}

/** Complete a phone change with the code sent to the new number. */
async function confirmPhoneChange(verificationId: string, code: string): Promise<PanelProfile | null> {
   const res = await request("/user/phone-change/confirm", {
      method: "POST",
      body: JSON.stringify({ verificationId, code }),
   })
   const body = (await res.json()) as { user?: PanelProfile }
   return body?.user ?? null
}

/* ------------------------------------------------------------------- orders */

async function getOrders(): Promise<{ orders: Order[]; summary: OrdersSummary }> {
   const res = await request("/orders")
   const body = (await res.json()) as { orders?: Order[]; summary?: OrdersSummary }
   return {
      orders: Array.isArray(body.orders) ? body.orders : [],
      summary: body.summary ?? { total: 0, byStatus: {} },
   }
}

async function getOrder(id: number): Promise<Order | null> {
   const res = await request(`/orders/${id}`)
   const body = (await res.json()) as { order?: Order }
   return body?.order ?? null
}

/* -------------------------------------------------------------- trade offers */

async function getTradeOffers(): Promise<{
   offers: TradeOffer[]
   pendingCount: number
   incoming: TradeOffer[]
   outgoing: TradeOffer[]
}> {
   const res = await request("/trade-offers")
   const body = (await res.json()) as {
      offers?: TradeOffer[]
      pendingCount?: number
      incoming?: TradeOffer[]
      outgoing?: TradeOffer[]
   }
   return {
      offers: Array.isArray(body.offers) ? body.offers : [],
      pendingCount: body.pendingCount ?? 0,
      incoming: Array.isArray(body.incoming) ? body.incoming : [],
      outgoing: Array.isArray(body.outgoing) ? body.outgoing : [],
   }
}

/** Accept or decline an incoming offer. Also advances the linked order. */
async function respondToTradeOffer(
   id: number,
   status: Extract<TradeOfferStatus, "accepted" | "declined">,
): Promise<{ offer: TradeOffer; order: Order | null }> {
   const res = await request(`/trade-offers/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
   const body = (await res.json()) as { offer?: TradeOffer; order?: Order | null }
   return { offer: body.offer as TradeOffer, order: body.order ?? null }
}

/* -------------------------------------------------------------------- wallet */

async function getWallet(): Promise<{ balance: number; transactions: WalletTransaction[] }> {
   const res = await request("/wallet")
   const body = (await res.json()) as { balance?: number; transactions?: WalletTransaction[] }
   return {
      balance: body.balance ?? 0,
      transactions: Array.isArray(body.transactions) ? body.transactions : [],
   }
}

/** Demo-only top-up. In production this is driven by the payment gateway. */
async function topUpWallet(amount: number, reference?: string): Promise<{ balance: number; transactions: WalletTransaction[] }> {
   const res = await request("/wallet/topup", { method: "POST", body: JSON.stringify({ amount, reference }) })
   const body = (await res.json()) as { balance?: number; transactions?: WalletTransaction[] }
   return {
      balance: body.balance ?? 0,
      transactions: Array.isArray(body.transactions) ? body.transactions : [],
   }
}

/**
 * Whether a payment gateway is actually connected, and the top-up bounds.
 *
 * While this says `configured: false` the wallet keeps using the demo top-up and
 * the top-up button says so instead of sending anybody to a gateway that is not
 * there. Connecting one is an `.env` change, not a code change.
 */
async function getPaymentConfig(): Promise<PaymentConfig> {
   const res = await request("/payments/config")
   const body = (await res.json()) as { payment?: PaymentConfig }
   return body?.payment ?? { provider: "unconfigured", configured: false, sandbox: false, minTopup: 10000, maxTopup: 500000000 }
}

/**
 * Open a top-up and get somewhere to send the customer.
 *
 * Answered with a 503 while no gateway is connected, which is a normal state here
 * rather than a fault - so the caller shows the demo hint instead of an error.
 */
async function startTopUp(amount: number): Promise<{ redirectUrl: string } | null> {
   const res = await fetch(`${API_BASE}/payments/intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ amount }),
   })

   if (!res.ok) return null

   const body = (await res.json()) as { redirect_url?: string }
   return body?.redirect_url ? { redirectUrl: body.redirect_url } : null
}

/* ------------------------------------------------------------------ wishlist */

async function getWishlist(): Promise<{ items: WishlistItem[]; count: number }> {
   const res = await request("/wishlist")
   const body = (await res.json()) as { items?: WishlistItem[]; count?: number }
   const items = Array.isArray(body.items) ? body.items : []
   return { items, count: body.count ?? items.length }
}

async function addToWishlist(productId: number, targetPrice?: number | null): Promise<{ items: WishlistItem[]; count: number }> {
   const res = await request("/wishlist", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, target_price: targetPrice ?? null }),
   })
   const body = (await res.json()) as { items?: WishlistItem[]; count?: number }
   const items = Array.isArray(body.items) ? body.items : []
   return { items, count: body.count ?? items.length }
}

async function removeFromWishlist(productId: number): Promise<{ items: WishlistItem[]; count: number }> {
   const res = await request(`/wishlist/${productId}`, { method: "DELETE" })
   const body = (await res.json()) as { items?: WishlistItem[]; count?: number }
   const items = Array.isArray(body.items) ? body.items : []
   return { items, count: body.count ?? items.length }
}

/* ---------------------------------------------------------------- inventory */

async function getInventory(): Promise<InventoryItem[]> {
   const res = await request("/inventory")
   const body = (await res.json()) as { items?: InventoryItem[] }
   return Array.isArray(body.items) ? body.items : []
}

export {
   getProfile,
   updateProfile,
   requestPhoneChange,
   confirmPhoneChange,
   getOrders,
   getOrder,
   getTradeOffers,
   respondToTradeOffer,
   getWallet,
   topUpWallet,
   getPaymentConfig,
   startTopUp,
   getWishlist,
   addToWishlist,
   removeFromWishlist,
   getInventory,
}