import type { InventoryItem, OrderItem } from "@/app/contracts/panel"
import { fa, faServiceLabels } from "@/app/lib/i18n/fa"

/**
 * Presentation for an order line.
 *
 * An order line is either a skin or a service, and the backend stores the two
 * differently on purpose:
 *
 *   - a skin keeps a snapshot `title` and `image`, because the product may later
 *     be edited or deleted and the order has to stay readable;
 *   - a service keeps only its machine values (`service`, `variant`) and a
 *     quantity, because the backend holds no Persian copy of anything.
 *
 * So the label for a service line is resolved here, on the client, from the same
 * dictionary the buy cards use. That keeps one translation table for the whole
 * app instead of a second one in SQL rows.
 *
 * Every checkout writes `image` for both kinds, so the artwork fallbacks below
 * only ever fire for rows written before this resolver existed.
 */

const SERVICE_ARTWORK: Record<string, string> = {
   prime: "/images/others/cs2-prime.webp",
   tf2_keys: "/images/others/tf2.png",
}

/**
 * Anything that can be a line: an order item, an inventory item or a cart line.
 *
 * Deliberately a shape rather than a union of the three, because they differ in
 * ways that do not matter here - a cart line's `price` may be null (its listing is
 * gone) and a cart line's `title` is same-typed but optional.
 */
interface LineLike {
   title?: string | null
   image?: string | null
   service?: string | null
   variant?: string | null
   quantity?: number | null
   price?: number | string | null
}

function serviceName(service: string | null | undefined): string | null {
   if (!service) return null
   return faServiceLabels[service]?.name ?? service
}

function variantName(service: string | null | undefined, variant: string | null | undefined): string | null {
   if (!service || !variant) return null
   return faServiceLabels[service]?.variants?.[variant] ?? variant
}

/**
 * What to call this line in a list.
 *
 * A skin uses its snapshot title. A service joins the good to the thing that
 * distinguishes it - «پرایم CS2 — آرژانتین» - because "Prime" alone does not say
 * which region was bought, and the region is the whole reason the prices differ.
 */
export function orderItemLabel(item: LineLike): string {
   if (item.service) {
      const name = serviceName(item.service)
      const variant = variantName(item.service, item.variant)

      return [name, variant].filter(Boolean).join(" — ")
   }

   return item.title ?? ""
}

/** The artwork to show for this line, falling back to the good's own shot. */
export function orderItemImage(item: LineLike): string | null {
   if (item.image) return item.image
   if (item.service) return SERVICE_ARTWORK[item.service] ?? null

   return null
}

/**
 * The multiplier to show beside a line, or null when there is nothing to say.
 *
 * A skin is a single physical item, so "× 1" is noise on every skin row; a
 * service line only earns the badge once more than one was bought.
 */
export function orderItemQuantity(item: LineLike): number | null {
   const quantity = Number(item.quantity ?? 1)

   return Number.isFinite(quantity) && quantity > 1 ? quantity : null
}

/** The unit price as a Toman figure, for a line whose total is not simply this. */
export function orderItemUnitHint(item: LineLike): string | null {
   const quantity = orderItemQuantity(item)
   const unitPrice = Number(item.price)

   if (!quantity || !Number.isFinite(unitPrice)) return null

   return `${fa.cart.unitPrice}: ${unitPrice.toLocaleString("en-US")} ${fa.currency}`
}
