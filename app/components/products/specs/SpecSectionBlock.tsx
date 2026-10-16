"use client"

import { motion, useReducedMotion } from "motion/react"
import {
   IdentificationIcon,
   SparklesIcon,
   ArchiveBoxIcon,
   ShoppingBagIcon,
} from "@heroicons/react/24/outline"
import type { ReactNode } from "react"
import type { SpecSection } from "@/app/lib/productSpecs"
import SpecRow from "./SpecRow"

/**
 * One specification block.
 *
 * The icon is chosen from the section's id rather than passed in, so a section can
 * never turn up on the page wearing the wrong metaphor.
 */
const ICONS: Record<SpecSection["id"], (props: { className?: string }) => ReactNode> = {
   identity: IdentificationIcon,
   wear: SparklesIcon,
   provenance: ArchiveBoxIcon,
   availability: ShoppingBagIcon,
}

export default function SpecSectionBlock({ section, index = 0 }: { section: SpecSection; index?: number }) {
   const prefersReduced = useReducedMotion()
   const Icon = ICONS[section.id]

   return (
      <motion.section
         initial={prefersReduced ? false : { opacity: 0, y: 12 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-60px" }}
         transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.28) }}
         className="group overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-xl hover:shadow-brand-500/5"
      >
         {/* The header carries a wash of the section's own colour rather than a flat
             fill, and the icon tile shifts hue on hover - the only movement in the
             card, so the eye goes to the heading first and the icon second. */}
         <header className="relative flex items-center gap-3 overflow-hidden border-b border-border-subtle bg-linear-to-l from-surface-muted to-surface px-4 py-3.5 sm:px-5">
            <span
               aria-hidden="true"
               className="absolute inset-y-0 -inset-s-10 w-24 bg-brand-400/10 blur-2xl transition-all duration-500 group-hover:inset-s-0"
            />

            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/12 text-brand-700 ring-1 ring-brand-500/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300">
               <Icon className="h-4 w-4" />
            </span>

            <h3 className="relative text-sm font-extrabold tracking-tight text-navy-950 dark:text-white">{section.title}</h3>

            <span
               aria-hidden="true"
               className="relative ms-auto h-px w-10 bg-linear-to-l from-brand-400/50 to-transparent"
            />
         </header>

         <div className="relative">
            {section.rows.map((row, rowIndex) => (
               <SpecRow key={`${section.id}-${row.label}`} row={row} index={rowIndex} />
            ))}
         </div>
      </motion.section>
   )
}