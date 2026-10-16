"use client"

import { motion, useReducedMotion } from "motion/react"
import { rarityTone } from "@/app/contracts/products"

/**
 * A rarity tier, drawn in the colour the CS2 market gives that tier.
 *
 * A buyer scanning a listing looks for the tier before they read anything else,
 * and the tier *is* the colour in their head. Rendering it as plain text throws
 * that away, so this is a tinted chip whose fill grows in rather than a label.
 */
export default function RarityChip({ rarity }: { rarity: string }) {
   const prefersReduced = useReducedMotion()
   const tone = rarityTone(rarity)

   return (
      <motion.span
         initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ type: "spring", stiffness: 320, damping: 22 }}
         className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold"
         style={tone}
      >
         {/* The tier's own colour, as a dot. The chip is readable in both themes
             because the text carries the contrast, not the dot. */}
         <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.color }} />
         {rarity}
      </motion.span>
   )
}