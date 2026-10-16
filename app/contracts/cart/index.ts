/**
 * The cart's shape, mirroring what `GET /cart` returns.
 *
 * A cart line is one of two things, discriminated by `kind`:
 *
 *   - a **product** line, keyed by `product_id`. A skin is a unique physical item,
 *     so its `quantity` is always 1 and `limit` is always 1.
 *   - a **service** line, keyed by (`service`, `variant`) - CS2 Prime by Steam
 *     region, TF2 keys by unit. These are bought in multiples, so `quantity` can
 *     climb up to `limit`.
 *
 * `title` is null for a service line on purpose: the backend stores machine values
 * only and holds no Persian copy, so the label is resolved on this side through
 * `app/lib/orderItems.ts`. Product lines carry the live title instead.
 *
 * There is no price stored on a line. Every read joins the live listing, so what
 * the cart shows is always what checkout would charge.
 */

import type { Category } from "@/app/contracts/products"

/** Why a line cannot be bought. `null` means it can. */
export type CartLineUnavailable = "missing" | "sold" | "out_of_stock" | null

export type CartLineKind = "product" | "service"

export interface CartLine {
   /** The cart line's own id, used by PATCH and DELETE. */
   id: number
   kind: CartLineKind
   /** Set on a product line, null on a service line. */
   product_id: number | null
   /** Set on a service line, null on a product line. */
   service: string | null
   variant: string | null
   quantity: number
   /** Live product title, or null for a service line. */
   title: string | null
   image: string | null
   category: Category | null
   /** Unit price in Toman, or null when the listing has gone. */
   price: number | null
   /** `price * quantity`, or 0 when the line cannot be bought. */
   lineTotal: number
   /** The highest quantity this line may hold right now. */
   limit: number
   /**
    * How many units are still buyable, and how many exist in total.
    *
    * `available` is what the stepper clamps to and what checkout will enforce, so
    * both are read from here rather than recomputed on the client - a figure the
    * storefront invented would be a figure the backend refuses.
    *
    * Both are null on a service line: its ceiling is `service_prices.stock` and
    * `max_quantity`, which `limit` already reduces to one number.
    */
   available: number | null
   stock: number | null
   /** Null when the line is fine to buy. */
   unavailable: CartLineUnavailable
}

export interface CartTotals {
   /** Number of lines. */
   lineCount: number
   /** Sum of quantities - what the header badge shows. */
   unitCount: number
   /** Sum of the available lines only, in Toman. */
   subtotal: number
   /** How many lines cannot be bought, so the UI can say so. */
   unavailableCount: number
}

export interface Cart {
   lines: CartLine[]
   totals: CartTotals
}

/** `GET /cart/count` - the badge, priced without pricing a single line. */
export interface CartCount {
   lines: number
   units: number
}

/** Machine codes the cart and checkout answer with. */
export type CartIssue =
   | "PRODUCT_NOT_FOUND"
   | "PRODUCT_SOLD"
   | "SERVICE_NOT_FOUND"
   | "OUT_OF_STOCK"
   | "LINE_NOT_FOUND"
   | "CART_EMPTY"
   | "CART_UNAVAILABLE"
   | "CART_CHANGED"
   | "NO_TRADE_URL"
   /** No verified phone on file. Signing in through Steam does not supply one. */
   | "PHONE_REQUIRED"
   | "INSUFFICIENT_FUNDS"
   | "ITEM_SOLD"
