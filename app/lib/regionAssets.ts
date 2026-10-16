import { fa } from "@/app/lib/i18n/fa"

/**
 * Persian labels and flag artwork for the Steam regions CS2 Prime is sold in,
 * keyed by the `variant` column in `service_prices`.
 *
 * These used to live inside `PrimeBuyCard`, but the cart and the order history
 * both show a Prime line too - and neither of those imports a buy card. A region
 * that exists in the database but has no entry here renders under its raw value
 * and without a flag, rather than blank.
 */
export const REGION_LABELS: Record<string, string> = fa.info.prime.regions

/**
 * Flag artwork for each Steam region.
 *
 * Paths rather than i18n keys: these are not translatable text, the same reason
 * `CATEGORY_ICONS` lives in `catalog.ts` instead of `fa.ts`. The six files are
 * barely 2KB together and never change, so they are served straight from
 * `/public` rather than through the image optimiser.
 */
export const REGION_FLAGS: Record<string, string> = {
   argentina: "/images/country-img/ar.png",
   europe: "/images/country-img/eu.png",
   india: "/images/country-img/in.png",
   turkey: "/images/country-img/tr.png",
   ukraine: "/images/country-img/ua.png",
   usa: "/images/country-img/us.png",
}

/** Product shot for the Prime upgrade, tightly cropped. */
export const PRIME_ARTWORK = "/images/others/cs2-prime.webp"

/**
 * Product shot for TF2 keys.
 *
 * The file is a 512x512 canvas whose key only occupies 433x292, so it is always
 * drawn with `object-cover` inside a box matching that content ratio - the
 * transparent margins get cropped instead of letterboxing the key into a small
 * square. The cart and the order history crop it the same way.
 */
export const TF2_KEY_ARTWORK = "/images/others/tf2.png"
