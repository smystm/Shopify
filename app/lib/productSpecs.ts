import type { AdminProduct, Category, Exterior } from "@/app/contracts/products"
import { EXTERIOR_FLOATS, WEAR_CATEGORIES } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"

/**
 * What a product page says about an item, worked out from the item.
 *
 * The point of this file is that nothing on the page is written as "if this is a
 * weapon, show...; otherwise show...". A product is handed in and the sections
 * come back already decided, in the order they should be read, containing only
 * the rows that mean something for *that* item. A case has no float because the
 * wear section is never produced for it - not because a component was asked to
 * hide one.
 *
 * It also means a new category is a data change and not a layout change: add the
 * fields to the schema, fill them, and the panel assembles itself.
 */
export type SpecValue =
   | { kind: "text"; text: string }
   /** A position on a 0.00-1.00 scale, drawn as a meter rather than as a number. */
   | { kind: "float"; value: number; min: number; max: number }
   /** A rarity tier, drawn in its own colour rather than as plain text. */
   | { kind: "rarity"; text: string }
   /**
    * How much of a listing is left, drawn as a fill.
    *
    * A bare "58 از 60" is a number; a bar that is nearly full tells you the same
    * thing before you have read it, which is the whole reason stock is worth
    * showing as a meter rather than a figure.
    */
   | { kind: "stock"; remaining: number; total: number }

export interface SpecRow {
   label: string
   value: SpecValue
   /** The small grey second line, where a bare value would be ambiguous. */
   hint?: string
}

export interface SpecSection {
   id: "identity" | "wear" | "provenance" | "availability"
   title: string
   rows: SpecRow[]
}

const copy = fa.products.specs

/** The item name without the trailing wear, so the panels can reuse the parts. */
export function splitTitle(title: string): { item: string; exterior: Exterior | null } {
   const match = /\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/.exec(title)
   if (!match) return { item: title, exterior: null }

   return { item: title.replace(/\s*\([^)]*\)\s*$/, "").trim(), exterior: match[1] as Exterior }
}

/** `broken_fang_gloves` -> `Broken Fang Gloves` */
function prettyKey(value: string | null | undefined): string | null {
   if (!value) return null

   return value
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
}

function categoryValue(category: Category | null | undefined): string {
   return category?.value ?? "other"
}

/** Only these categories have wear. Everything else returns null. */
export function exteriorOf(product: AdminProduct): Exterior | null {
   if (!WEAR_CATEGORIES.includes(categoryValue(product.category))) return null
   return (product.exterior as Exterior | null) ?? null
}

function releaseLabel(value: number | string | null | undefined): string | null {
   if (value === null || value === undefined || value === "") return null

   const date = new Date(typeof value === "string" && !/^\d+$/.test(value) ? value : Number(value))
   if (Number.isNaN(date.getTime())) return null

   // Persian digits, same as the rest of the shop, and a Gregorian year: the
   // audience is Iranian and reads these dates on a global market.
   return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", calendar: "persian" }).format(date)
}

/**
 * Every section that has something to say about this product, in reading order.
 *
 * Returns an empty array only for a product with no identity at all, which cannot
 * happen - but the caller should still cope, because an empty panel is a worse
 * failure than a missing one.
 */
export function specSectionsFor(product: AdminProduct): SpecSection[] {
   const sections: SpecSection[] = []
   const exterior = exteriorOf(product)
   const { item } = splitTitle(product.title)

   /* ------------------------------------------------------------- identity */
   const identity: SpecRow[] = [
      { label: copy.itemNumber, value: { kind: "text", text: product.productNumber } },
      { label: copy.itemName, value: { kind: "text", text: item } },
   ]

   const subcategory = prettyKey(product.category?.subcategory)
   const category = prettyKey(product.category?.value)

   if (category) identity.push({ label: copy.category, value: { kind: "text", text: category } })
   if (subcategory) identity.push({ label: copy.subcategory, value: { kind: "text", text: subcategory } })

   sections.push({ id: "identity", title: copy.identityTitle, rows: identity })

   /* ----------------------------------------------------------------- wear */
   // Only ever built when the item actually has one. This is the whole trick.
   if (exterior) {
      const band = EXTERIOR_FLOATS[exterior]
      const rows: SpecRow[] = [{ label: copy.exterior, value: { kind: "text", text: exterior } }]

      rows.push({
         label: copy.floatRange,
         value: { kind: "text", text: `${band.min.toFixed(2)} – ${band.max.toFixed(2)}` },
         hint: copy.floatHint,
      })

      const position = typeof product.pattern_index === "number" ? product.pattern_index : null

      if (position !== null && position >= band.min && position <= band.max) {
         rows.push({ label: copy.floatValue, value: { kind: "float", value: position, min: band.min, max: band.max } })
      }

      sections.push({ id: "wear", title: copy.wearTitle, rows })
   }

   /* ----------------------------------------------------------- provenance */
   const provenance: SpecRow[] = []

   if (product.rarity) provenance.push({ label: copy.rarity, value: { kind: "rarity", text: product.rarity } })
   if (product.collection) provenance.push({ label: copy.collection, value: { kind: "text", text: product.collection } })

   const released = releaseLabel(product.release_at)
   if (released) provenance.push({ label: copy.releaseDate, value: { kind: "text", text: released } })

   if (provenance.length) sections.push({ id: "provenance", title: copy.provenanceTitle, rows: provenance })

   /* --------------------------------------------------------- availability */
   // Never omitted: whether this copy can still be bought is the one thing a
   // customer is always owed, whatever kind of item it is.
   const availability: SpecRow[] = []

   const total = typeof product.count === "number" && product.count > 0 ? product.count : null
   if (total !== null) {
      const remaining = Math.max(0, total - (typeof product.sold_count === "number" ? product.sold_count : 0))

      availability.push({
         label: copy.stock,
         value: { kind: "stock", remaining, total },
      })
   }

   // The RAW `sold_order_id`, not a boolean derived from it. Passing the derived
   // flag in here reads `false !== null` as true and marks every product sold.
   const soldOut = remainingZero(product.sold_order_id, product)

   availability.push({
      label: copy.availability,
      value: { kind: "text", text: soldOut ? copy.sold : copy.available },
      hint: soldOut ? copy.soldHint : copy.availableHint,
   })

   sections.push({ id: "availability", title: copy.availabilityTitle, rows: availability })

   return sections
}

/**
 * Sold, on either reading.
 *
 * `sold_order_id` is the pre-stock flag and `sold_count` is the current one, and
 * an item migrated from before stock existed only has the first. Reading either
 * keeps a genuinely sold item from looking available.
 */
function remainingZero(soldOrderId: unknown, product: AdminProduct): boolean {
   if (soldOrderId !== null && soldOrderId !== undefined) return true

   const total = typeof product.count === "number" && product.count > 0 ? product.count : 1
   const sold = typeof product.sold_count === "number" ? product.sold_count : 0

   return sold >= total
}

/** The badges that sit beside the title. Empty for items that have neither. */
export function badgesFor(product: AdminProduct): Array<"stattrak" | "souvenir"> {
   const badges: Array<"stattrak" | "souvenir"> = []
   if (product.souvenir) badges.push("souvenir")
   if (product.stattrak) badges.push("stattrak")
   return badges
}