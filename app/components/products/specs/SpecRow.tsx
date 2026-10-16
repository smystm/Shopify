"use client"

import { motion, useReducedMotion } from "motion/react"
import type { SpecRow as SpecRowType, SpecValue } from "@/app/lib/productSpecs"
import RarityChip from "./RarityChip"
import StockMeter from "./StockMeter"

/**
 * One specification line.
 *
 * The value is either text or a float position, and the difference matters: a
 * bare `0.2300` is a number nobody can act on, while a bar sitting at 23% of a
 * band they can already see labelled is immediately readable. That is the entire
 * reason the union exists.
 */
export default function SpecRow({ row, index = 0 }: { row: SpecRowType; index?: number }) {
   const prefersReduced = useReducedMotion()

   return (
      <motion.div
         initial={prefersReduced ? false : { opacity: 0, y: 6 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-40px" }}
         transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.24) }}
         className="group/row flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border-subtle px-4 py-3.5 transition-colors last:border-b-0 hover:bg-surface-muted sm:px-5"
      >
         <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-navy-500 transition-colors duration-200 group-hover/row:text-navy-700 dark:text-navy-400 dark:group-hover/row:text-navy-200">
            <span
               aria-hidden="true"
               className="h-1 w-1 rounded-full bg-brand-400 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100"
            />
            {row.label}
         </span>

         <span className="flex min-w-0 flex-col items-end gap-1">
            <SpecValueView value={row.value} />
            {row.hint ? <span className="text-[11px] leading-4 text-navy-400 dark:text-navy-500">{row.hint}</span> : null}
         </span>
      </motion.div>
   )
}

function SpecValueView({ value }: { value: SpecValue }) {
   if (value.kind === "text") {
      return <span className="text-end text-sm font-bold text-navy-950 dark:text-white">{value.text}</span>
   }

   if (value.kind === "rarity") return <RarityChip rarity={value.text} />

   if (value.kind === "stock") return <StockMeter remaining={value.remaining} total={value.total} />

   return <FloatMeter value={value.value} min={value.min} max={value.max} />
}

/**
 * Where this copy sits inside its exterior's band.
 *
 * Drawn against 0.00-1.00 rather than against its own band, because the band is
 * already named in the row above - what the bar has to communicate is "low end
 * or high end of the possible range", and that only reads correctly on the full
 * scale.
 */
function FloatMeter({ value, min, max }: { value: number; min: number; max: number }) {
   const prefersReduced = useReducedMotion()
   const clamped = Math.min(1, Math.max(0, value))
   const inBand = value >= min && value <= max

   return (
      <span className="flex w-full max-w-52 flex-col items-end gap-1.5">
         <span dir="ltr" className="text-sm font-extrabold tabular-nums text-navy-950 dark:text-white">
            {value.toFixed(4)}
         </span>

         <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
            <motion.span
               initial={prefersReduced ? false : { scaleX: 0 }}
               whileInView={{ scaleX: clamped }}
               viewport={{ once: true, margin: "-40px" }}
               transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.15 }}
               className={`absolute inset-y-0 end-0 w-full origin-right rounded-full ${
                  inBand
                     ? "bg-linear-to-l from-brand-700 to-brand-500"
                     : "bg-accent-400"
               }`}
               style={{ scaleX: clamped }}
            />
         </span>

         {/* The band this exterior covers, so the position has a reference. */}
         <span className="relative block h-1 w-full" aria-hidden="true">
            <span
               className="absolute inset-y-0 rounded-full bg-brand-500/25 ring-1 ring-brand-500/40"
               style={{ insetInlineStart: `${min * 100}%`, width: `${(max - min) * 100}%` }}
            />
         </span>
      </span>
   )
}