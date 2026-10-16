/**
 * Prices for the store's non-skin goods.
 *
 * CS2 Prime is sold per Steam region and TF2 keys per unit, and neither belongs
 * in the product catalogue: a product's category is matched against the folder
 * names under `public/images/weapons-real/skins`, so a `prime` row would also
 * have surfaced as a category tile on the home page, as an entry in the product
 * filter, and inside the live catalogue counts.
 *
 * Field names mirror the `service_prices` table, the way the product contract
 * mirrors `products`.
 */

/** The goods this table prices. */
export type ServiceName = "prime" | "tf2_keys"

export interface ServicePrice {
    id: number
    /** Which good this row prices. */
    service: ServiceName | string
    /**
     * Machine value - `argentina`, `usa`, `key`. The Persian label lives in
     * `fa.info.prime.regions` and `fa.info.tf2Keys`, keyed by this value, the
     * same way category folder names are labelled through `fa.ts`.
     */
    variant: string
    /**
     * Toman. Stored as text exactly like `products.price`, and never converted -
     * `formatToman` only decides how the amount is written.
     */
    price: string
    /** Units on hand, or null where the good is not stocked. */
    stock: number | null
    /**
     * Per-order buyer cap. For keys this is Steam's own 50-item hold limit
     * rather than stock, so the quantity stepper clamps to it.
     */
    max_quantity: number | null
    /**
     * Artwork, snapshotted into `order_items.image` at checkout so an order stays
     * readable on its own. Null only for a row seeded before the column existed.
     */
    image?: string | null
    /** Display order within one service. */
    position: number
}
