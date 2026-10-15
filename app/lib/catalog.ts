/**
 * Shared catalogue vocabulary.
 *
 * Categories and subcategories are directory names under
 * `public/images/weapons-real/skins/<category>/<subcategory>/product.png`, so
 * the values here are those directory names verbatim. Copy (labels) lives in
 * `fa.ts`; only non-translatable data belongs in this file.
 */

import type { AdminProduct } from "@/app/contracts/products"

/**
 * Browse order for the category strip.
 *
 * Categories arrive from the backend as an alphabetical directory listing,
 * which is an arbitrary order for a browse strip: the highest-volume
 * categories end up scattered and the catch-all bucket sits in the middle.
 * This pins a deliberate order instead and leaves `other` last.
 */
export const CATEGORY_ORDER: readonly string[] = ["knife", "gloves", "pistol", "rifle", "sniper", "smg", "shotgun", "machinegun", "agent", "case", "music_kit", "other"]

/**
 * Every glyph in `public/icons/cs2/` is `fill="#ffffff"`, so they are rendered
 * as a CSS mask over `bg-current` rather than as images - see `categoryIcon`.
 * `other` falls back to the taser because it is the only unused glyph; swap it
 * here if a better catch-all icon lands in that folder.
 */
export const CATEGORY_ICONS: Record<string, string> = {
   all: "/icons/cs2/inventory.svg",
   knife: "/icons/cs2/knife_karambit.svg",
   gloves: "/icons/cs2/clothing_hands.svg",
   pistol: "/icons/cs2/deagle.svg",
   rifle: "/icons/cs2/ak47.svg",
   sniper: "/icons/cs2/awp.svg",
   smg: "/icons/cs2/mp9.svg",
   shotgun: "/icons/cs2/nova.svg",
   machinegun: "/icons/cs2/negev.svg",
   agent: "/icons/cs2/customplayer.svg",
   case: "/icons/cs2/inventory.svg",
   music_kit: "/icons/cs2/music_kit.svg",
   other: "/icons/cs2/taser.svg",
}

/** Weapon names whose directory name is not a presentable label. */
const SPECIAL_NAMES: Record<string, string> = {
   ak47: "AK-47",
   aug: "AUG",
   awp: "AWP",
   cz75_auto: "CZ75 Auto",
   deagle: "Desert Eagle",
   fbi: "FBI",
   fbi_swat: "FBI SWAT",
   g3sg1: "G3SG1",
   glock_18: "Glock-18",
   m4a1_s: "M4A1-S",
   m4a4: "M4A4",
   m9_bayonet: "M9 Bayonet",
   mp5_sd: "MP5-SD",
   pp_bizon: "PP-Bizon",
   r8_revolver: "R8 Revolver",
   scar20: "SCAR-20",
   sg553: "SG 553",
   ssg08: "SSG 08",
   usp_s: "USP-S",
   xm1014: "XM1014",
}

/**
 * A product guaranteed to have artwork.
 *
 * `image` is nullable in the contract, but every showcase surface renders the
 * image as the centrepiece, so rows without one are filtered out rather than
 * rendered as an empty box.
 */
export type ProductWithImage = AdminProduct & { image: string }

export function hasImage(product: AdminProduct): product is ProductWithImage {
   return Boolean(product.image)
}

/** `bayonet` -> `Bayonet`, `desert_eagle` -> `Desert Eagle`. */
export function displayName(value: string): string {
   if (SPECIAL_NAMES[value]) return SPECIAL_NAMES[value]

   return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

/**
 * Renders a category glyph as a mask over the current text colour, so one
 * white-filled SVG works in both themes instead of needing a dark variant.
 */
export function categoryIconClass(categoryValue: string, className = "h-5 w-7"): string {
   return `inline-block shrink-0 bg-current mask-center mask-no-repeat mask-contain ${className}`
}

export function categoryIconStyle(categoryValue: string): React.CSSProperties {
   const icon = CATEGORY_ICONS[categoryValue] ?? CATEGORY_ICONS.other
   return { maskImage: `url("${icon}")`, WebkitMaskImage: `url("${icon}")` }
}
