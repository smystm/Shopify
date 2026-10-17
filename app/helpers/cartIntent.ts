import { CartApiError, addProductToCart, addServiceToCart, isSignedOut } from "./cartApi"

/**
 * The one thing a signed-out customer's click leaves behind.
 *
 * The cart itself is account-backed and has no guest mode on purpose, so someone
 * who is not signed in yet cannot own a line. What they *can* own is the
 * intention: this remembers which item they picked, and the moment they are signed
 * in the intention is spent on a real cart line.
 *
 * It is a note to self, not a second cart. Nothing here is ever priced, counted by
 * the header badge, or checked out, so there is no state to reconcile and nothing
 * to merge - the only two endings are "added" and "forgotten".
 */
const KEY = "shopy-cart-intent"

export type CartIntent =
   | { kind: "product"; productId: number }
   | { kind: "service"; service: string; variant: string; quantity: number }

export type ReplayResult =
   | { status: "none" }
   | { status: "added"; intent: CartIntent }
   /** Still signed out. The note is kept for the next attempt. */
   | { status: "waiting" }
   /** The item cannot be had any more. The note is dropped, not retried. */
   | { status: "dropped"; reason: CartApiError["code"] }

function read(): CartIntent | null {
   if (typeof window === "undefined") return null

   try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw) as CartIntent

      if (parsed?.kind === "product" && Number.isFinite(parsed.productId)) return parsed
      if (parsed?.kind === "service" && parsed.service && parsed.variant && Number.isFinite(parsed.quantity)) return parsed

      return null
   } catch {
      // A corrupt entry is not worth reporting: the worst case is that the customer
      // adds the item again by hand.
      return null
   }
}

/** Called by a button whose add came back 403. */
export function rememberCartIntent(intent: CartIntent): void {
   if (typeof window === "undefined") return

   try {
      window.localStorage.setItem(KEY, JSON.stringify(intent))
   } catch {
      // Private mode, a full quota, storage disabled - the customer simply signs in
      // and adds it again. Nothing here is worth failing a click over.
   }
}

export function forgetCartIntent(): void {
   if (typeof window === "undefined") return

   try {
      window.localStorage.removeItem(KEY)
   } catch {
      /* see rememberCartIntent */
   }
}

/** Is there something waiting to be added? Used only for wording, never pricing. */
export function peekCartIntent(): CartIntent | null {
   return read()
}

/**
 * Spend the note, if there is one.
 *
 * Called once the customer is known to be signed in. 403 is the interesting
 * failure: it means the sign-in has not landed yet, so the note is deliberately
 * kept rather than thrown away - losing it here is exactly the "silently lost cart
 * item" this design exists to avoid. Every other refusal means the item is gone,
 * and retrying it forever would be worse than forgetting it.
 */
export async function replayCartIntent(): Promise<ReplayResult> {
   const intent = read()
   if (!intent) return { status: "none" }

   try {
      if (intent.kind === "product") {
         await addProductToCart(intent.productId)
      } else {
         await addServiceToCart(intent.service, intent.variant, intent.quantity)
      }

      forgetCartIntent()
      return { status: "added", intent }
   } catch (error) {
      if (isSignedOut(error)) {
         return { status: "waiting" }
      }

      forgetCartIntent()
      return { status: "dropped", reason: error instanceof CartApiError ? error.code : "UNKNOWN" }
   }
}
