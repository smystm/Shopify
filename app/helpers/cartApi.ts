import type { Cart, CartCount, CartIssue, CartLine } from "@/app/contracts/cart"
import type { Order } from "@/app/contracts/panel"
import { getLoginToken } from "./auth"

/**
 * The cart and its checkout, talked to from the browser.
 *
 * `panelApi` sits alongside this and throws a plain `Error` on any non-OK reply,
 * which is fine when the only failure you can show is "something went wrong". The
 * cart cannot work that way: "top up your wallet" and "somebody else just bought
 * that skin" are both failures, and they need completely different answers. So the
 * backend's machine `code` is carried through on the error object and the UI
 * branches on it - never on the message, which is English and not shown.
 */

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

/**
 * Fired on `window` whenever a cart-changing call succeeds.
 *
 * The header badge lives in a different component tree from the buttons that add
 * things to the cart, and neither owns the other. A DOM event is the smallest
 * bridge between them that needs no store, no context and no prop drilling.
 */
export const CART_CHANGED = "shopy:cart-changed"

/** A rejected cart or checkout call, with the backend's machine code attached. */
export class CartApiError extends Error {
   code: CartIssue | "VALIDATION" | "UNKNOWN"
   status: number
   /** Present on INSUFFICIENT_FUNDS: `{ balance, required }`. */
   details: Record<string, unknown> | null
   /** Present on a 422: field name -> message. */
   fieldErrors: Record<string, string> | null

   constructor(
      code: CartApiError["code"],
      message: string,
      status: number,
      details: Record<string, unknown> | null = null,
      fieldErrors: Record<string, string> | null = null,
   ) {
      super(message)
      this.name = "CartApiError"
      this.code = code
      this.status = status
      this.details = details
      this.fieldErrors = fieldErrors
   }
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
   const token = getLoginToken()

   const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: token } : {}),
         ...(init?.headers ?? {}),
      },
      credentials: "include",
      cache: "no-store",
   })

   const text = await res.text()

   let body: Record<string, unknown> | null = null
   try {
      body = text ? (JSON.parse(text) as Record<string, unknown>) : null
   } catch {
      /* A non-JSON body means an upstream failure, not a cart answer. */
   }

   if (!res.ok) {
      // The validate middleware answers 422 with `{ type, errors }` rather than a
      // code, so that one shape is normalised into the same error object.
      const fieldErrors = (body?.errors as Record<string, string> | undefined) ?? null
      const code = (body?.code as CartIssue | undefined) ?? (fieldErrors ? "VALIDATION" : "UNKNOWN")

      throw new CartApiError(
         code,
         typeof body?.message === "string" ? body.message : `${init?.method ?? "GET"} ${path} failed with ${res.status}`,
         res.status,
         (body?.details as Record<string, unknown> | undefined) ?? null,
         fieldErrors,
      )
   }

   // Any write to the cart or a new order changes the header badge, and this is
   // the one funnel every such call goes through - so the announcement is made
   // here rather than in each button, which would eventually forget.
   if (typeof window !== "undefined" && init?.method && init.method !== "GET" && !path.startsWith("/payments")) {
      window.dispatchEvent(new Event(CART_CHANGED))
   }

   if (!body) {
      throw new CartApiError("UNKNOWN", `${init?.method ?? "GET"} ${path} returned nothing parseable`, res.status)
   }

   return body
}

function asCart(body: unknown): Cart {
   const parsed = body as { lines?: CartLine[]; totals?: Cart["totals"] }

   return {
      lines: Array.isArray(parsed?.lines) ? parsed.lines : [],
      totals: parsed?.totals ?? { lineCount: 0, unitCount: 0, subtotal: 0, unavailableCount: 0 },
   }
}

/** GET /cart — every line priced live, plus the totals. */
export async function getCart(): Promise<Cart> {
   return asCart(await request("/cart"))
}

/** GET /cart/count — the header badge, without pricing a single line. */
export async function getCartCount(): Promise<CartCount> {
   const body = (await request("/cart/count")) as { count?: CartCount }

   return body?.count ?? { lines: 0, units: 0 }
}

/** POST /cart with a skin. Adding one that is already there accumulates onto it. */
export async function addProductToCart(productId: number, quantity = 1): Promise<Cart> {
   return asCart(await request("/cart", { method: "POST", body: JSON.stringify({ product_id: productId, quantity }) }))
}

/**
 * POST /cart with a service line. The quantity accumulates onto any existing line.
 *
 * Both adds clamp to what is left rather than refusing. The backend answers with
 * the whole cart, so the caller reads the real quantity back out of it - a stepper
 * that showed four while the cart quietly held three would be worse than the
 * clamp itself.
 */
export async function addServiceToCart(service: string, variant: string, quantity = 1): Promise<Cart> {
   return asCart(await request("/cart", { method: "POST", body: JSON.stringify({ service, variant, quantity }) }))
}

/** PATCH /cart/:lineId — set an exact quantity. Clamped to what is left, by the backend. */
export async function setCartQuantity(lineId: number, quantity: number): Promise<Cart> {
   return asCart(await request(`/cart/${lineId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }))
}

/** DELETE /cart/:lineId */
export async function removeCartLine(lineId: number): Promise<Cart> {
   return asCart(await request(`/cart/${lineId}`, { method: "DELETE" }))
}

/** DELETE /cart */
export async function clearCart(): Promise<Cart> {
   return asCart(await request("/cart", { method: "DELETE" }))
}

/**
 * POST /orders — buy everything in the cart.
 *
 * Takes no body on purpose: what is being bought is whatever the cart holds,
 * priced live, so a client can never name its own prices. The reply carries the
 * order to land on.
 */
export async function checkout(): Promise<Order> {
   const body = (await request("/orders", { method: "POST" })) as { order?: Order }

   if (!body?.order) {
      throw new CartApiError("UNKNOWN", "Checkout returned no order", 200)
   }

   return body.order
}
