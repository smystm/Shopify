"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArchiveBoxIcon, SparklesIcon, TagIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"
import { rarityTone } from "@/app/contracts/products"
import { exteriorOf, splitTitle } from "@/app/lib/productSpecs"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The four facts a buyer checks first, answered before they scroll.
 *
 * Exterior, rarity, collection and the market hash the title carries. Each is only
 * present when the item has it, so a case shows its collection and a charm shows
 * its rarity and neither gets a row of empty placeholders.
 *
 * This is a summary, not a second copy of the specifications panel below - the
 * point is that the panel exists but does not have to be found to answer "how new
 * is this and where did it come from".
 */
export default function QuickFacts({ product }: { product: AdminProduct }) {
   const prefersReduced = useReducedMotion()
   const exterior = exteriorOf(product)
   const { item } = splitTitle(product.title)

   const facts: Array<{ key: string; label: string; content: React.ReactNode }> = []

   if (exterior) {
      facts.push({
         key: "exterior",
         label: fa.products.specs.exterior,
         content: (
            <span className="inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
               <SparklesIcon className="h-4 w-4" aria-hidden="true" />
               {exterior}
            </span>
         ),
      })
   }

   if (product.rarity) {
      const tone = rarityTone(product.rarity)

      facts.push({
         key: "rarity",
         label: fa.products.specs.rarity,
         content: (
            <span className="inline-flex items-center gap-1.5 font-extrabold" style={{ color: tone.color }}>
               <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.color }} />
               {product.rarity}
            </span>
         ),
      })
   }

   if (product.collection) {
      facts.push({
         key: "collection",
         label: fa.products.specs.collection,
         content: (
            <span className="inline-flex items-center gap-1.5">
               <ArchiveBoxIcon className="h-4 w-4" aria-hidden="true" />
               {product.collection}
            </span>
         ),
      })
   }

   facts.push({
      key: "item",
      label: fa.products.specs.itemName,
      content: (
         <span className="inline-flex items-center gap-1.5">
            <TagIcon className="h-4 w-4" aria-hidden="true" />
            {item}
         </span>
      ),
   })

   if (facts.length === 0) return null

   return (
      <motion.ul
         initial={prefersReduced ? false : { opacity: 0, y: -8 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, delay: 0.15 }}
         className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
         {facts.map((fact) => (
            <li
               key={fact.key}
               className="group flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-surface-muted hover:shadow-md hover:shadow-brand-500/5"
            >
               <span className="shrink-0 text-[11px] font-bold text-navy-500 dark:text-navy-400">{fact.label}</span>
               <span className="min-w-0 truncate text-xs font-bold text-navy-900 transition-colors group-hover:text-brand-800 dark:text-navy-100 dark:group-hover:text-brand-200">
                  {fact.content}
               </span>
            </li>
         ))}
      </motion.ul>
   )
}