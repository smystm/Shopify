export interface Category {
    id: number
    value: string
    subcategories?: string[]
    subcategory?: string
}

/**
 * Sort orders for the product list. `""` means "leave the backend default",
 * which is oldest-first. A closed union so an unknown `?sort=` cannot reach the
 * backend as an unchecked string.
 */
export type ProductSort = "" | "price_asc" | "price_desc" | "best_selling"

/**
 * The full marketplace filter state, and the single source of truth both filter
 * components slice from. `ProductCategoryFilter` emits only the category half
 * and `ProductPriceFilter` emits the search, sort and price half; each caller
 * merges its slice back over the current state before rebuilding the query
 * string.
 */
export interface ProductFilterState {
    selectedCategory: string
    selectedSubcategories: string[]
    minPrice: string
    maxPrice: string
    search: string
    sort: ProductSort
}

/**
 * The five CS2 exteriors, with the float bounds Valve pairs them with.
 *
 * Shared by the contract (so the admin can validate) and by the product page's
 * float meter (so the bar is drawn against the real band, not a guess).
 */
export type Exterior = "Factory New" | "Minimal Wear" | "Field-Tested" | "Well-Worn" | "Battle-Scarred"

export const EXTERIOR_FLOATS: Record<Exterior, { min: number; max: number }> = {
    "Factory New": { min: 0, max: 0.07 },
    "Minimal Wear": { min: 0.07, max: 0.15 },
    "Field-Tested": { min: 0.15, max: 0.38 },
    "Well-Worn": { min: 0.38, max: 0.45 },
    "Battle-Scarred": { min: 0.45, max: 1 },
}

/** Categories whose items carry wear. Everything else never shows a float. */
export const WEAR_CATEGORIES = ["knife", "gloves", "rifle", "pistol", "smg", "sniper", "shotgun", "machinegun"]

/**
 * The CS2 item specifications.
 *
 * Every field is optional, and that is the whole design: a weapon skin fills in
 * the exterior and the float range, a case fills in neither, and the product page
 * renders whichever sections actually have something to say. Nothing here is
 * required, because a case genuinely has no float and a required column would be
 * either a lie or a permanent exception.
 */
export interface ProductSpecs {
    /** Absent on cases, music kits, agents, stickers, charms and patches. */
    exterior?: Exterior | null
    /** The real float band that goes with `exterior`. */
    float_min?: number | null
    float_max?: number | null
    /** Where this copy sits inside its band. `pattern_index` in Valve's terms. */
    pattern_index?: number | null
    /** StatTrak™ - a distinct variant of the same skin. */
    stattrak?: number | null
    /** Souvenir - a distinct product with its own title. */
    souvenir?: number | null
    rarity?: string | null
    /** Which case it came out of, e.g. "Revolution Case". */
    collection?: string | null
    release_at?: number | string | null
}

/**
 * The colour each rarity tier is drawn in.
 *
 * These are the conventional tier tints the CS2 market uses everywhere, and they
 * are decoration only - nothing is decided by them. A tier that is not listed
 * falls back to the shop's brand colour rather than to nothing, so a new rarity
 * added to the catalogue still renders.
 */
export const RARITY_TONE: Record<string, { text: string; bg: string; border: string; ring: string }> = {
   "Consumer": { text: "#5b6b7f", bg: "#b0c3d9", border: "#9fb3cb", ring: "#b0c3d9" },
   "Industrial": { text: "#7c4dff", bg: "#5e35b1", border: "#4a2a8c", ring: "#5e35b1" },
   "Mil-Spec": { text: "#4a69bd", bg: "#4a69bd", border: "#3b5499", ring: "#4a69bd" },
   "Restricted": { text: "#8a6d3b", bg: "#8a6d3b", border: "#6f5730", ring: "#8a6d3b" },
   "Classified": { text: "#b8860b", bg: "#d4a537", border: "#a8822a", ring: "#d4a537" },
   "Covert": { text: "#b13d2e", bg: "#b13d2e", border: "#8e2f23", ring: "#b13d2e" },
   "Extraordinary": { text: "#a67c00", bg: "#e8b923", border: "#c39d17", ring: "#e8b923" },
   "Contraband": { text: "#a67c00", bg: "#e8b923", border: "#c39d17", ring: "#e8b923" },
}

/** Tailwind classes for a rarity chip, whichever tier it is. */
export function rarityTone(rarity: string | null | undefined) {
   const tone = (rarity ? RARITY_TONE[rarity] : undefined) ?? RARITY_TONE["Consumer"]
   return {
      color: tone.text,
      backgroundColor: `${tone.bg}1f`,
      borderColor: `${tone.border}66`,
      boxShadow: `0 0 0 1px ${tone.ring}33`,
   }
}

export interface AdminProduct extends ProductSpecs {
    id: number
    productNumber: string
    price: string
    title: string
    desc: string
    category: Category
    created_at?: number | string | null
    image: string | null
    // User ID of the user who created this product.
    created_by?: number | null
    /** Set once the item has been sold; null while it is still available. */
    sold_order_id?: number | null
    /**
     * How many copies exist, and how many have gone. Availability is the
     * difference, and a NULL `count` reads as 1 - never as unlimited.
     */
    count?: number | null
    sold_count?: number | null
}
