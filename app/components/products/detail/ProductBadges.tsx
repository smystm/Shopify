"use client"

import { motion, useReducedMotion } from "motion/react"
import type { AdminProduct } from "@/app/contracts/products"
import { badgesFor, exteriorOf } from "@/app/lib/productSpecs"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The chips that sit under the title.
 *
 * Only ever rendered when the item has one: a souvenir is a distinct product and
 * says so, StatTrak is a capability the buyer pays extra for and says so, and an
 * exterior is the single most important fact about a skin. A case has none of
 * them and renders nothing at all rather than a row of placeholders.
 */
export default function ProductBadges({ product }: { product: AdminProduct }) {
   const prefersReduced = useReducedMotion()
   const badges = badgesFor(product)
   const exterior = exteriorOf(product)

   if (badges.length === 0 && !exterior) return null

   return (
      <motion.div
         initial={prefersReduced ? false : { opacity: 0, y: -6 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.35, delay: 0.1 }}
         className="mt-3 flex flex-wrap items-center gap-2"
      >
         {exterior ? (
            <Chip tone="brand" title={exterior}>
               {exterior}
            </Chip>
         ) : null}

         {badges.includes("stattrak") ? (
            <Chip tone="accent" title={fa.products.specs.stattrakHint}>
               {fa.products.specs.stattrak}
            </Chip>
         ) : null}

         {badges.includes("souvenir") ? (
            <Chip tone="accent" title={fa.products.specs.souvenirHint}>
               {fa.products.specs.souvenir}
            </Chip>
         ) : null}
      </motion.div>
   )
}

function Chip({
   children,
   tone,
   title,
}: {
   children: React.ReactNode
   tone: "brand" | "accent"
   title?: string
}) {
   return (
      <span
         title={title}
         className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold transition-all duration-300 hover:-translate-y-0.5 ${
            tone === "brand"
               ? "border-brand-500/30 bg-brand-50/80 text-brand-700 hover:shadow-md hover:shadow-brand-500/20 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300"
               : "border-accent-400/40 bg-accent-400/10 text-accent-700 hover:shadow-md hover:shadow-accent-400/20 dark:text-accent-300"
         }`}
      >
         {children}
      </span>
   )
}