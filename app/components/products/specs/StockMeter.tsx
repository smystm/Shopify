"use client"

import { motion, useReducedMotion } from "motion/react"

/**
 * How much of a listing is left.
 *
 * The fill is the message and the figures are the detail, which is the reverse of
 * the usual arrangement on purpose: a bar that is nearly full says "plenty" before
 * anyone reads a number, and the number is only needed by someone who is deciding
 * between two listings.
 *
 * The colour shifts as it empties. A bar that was green and is now amber is a
 * change the eye catches without it being announced.
 */
export default function StockMeter({ remaining, total }: { remaining: number; total: number }) {
   const prefersReduced = useReducedMotion()
   const safeTotal = total > 0 ? total : 1
   const ratio = Math.min(1, Math.max(0, remaining / safeTotal))
   const gone = remaining <= 0

   const tone = gone
      ? { fill: "bg-accent-400", text: "text-accent-700 dark:text-accent-300" }
      : ratio <= 0.2
        ? { fill: "bg-accent-400", text: "text-accent-700 dark:text-accent-300" }
        : ratio <= 0.5
          ? { fill: "bg-brand-400", text: "text-brand-700 dark:text-brand-300" }
          : { fill: "bg-linear-to-l from-brand-600 to-emerald-500", text: "text-emerald-700 dark:text-emerald-300" }

   return (
      <span className="flex w-full min-w-32 max-w-56 flex-col items-end gap-1.5">
         <span className={`text-sm font-extrabold tabular-nums ${tone.text}`}>
            {gone ? (
               "۰"
            ) : (
               <>
                  {remaining.toLocaleString("fa-IR")}
                  <span className="mx-1 text-[11px] font-bold opacity-60">از</span>
                  {total.toLocaleString("fa-IR")}
               </>
            )}
         </span>

         <span className="relative block h-2 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
            <motion.span
               initial={prefersReduced ? false : { scaleX: 0 }}
               whileInView={{ scaleX: ratio }}
               viewport={{ once: true, margin: "-40px" }}
               transition={{ type: "spring", stiffness: 110, damping: 20, delay: 0.1 }}
               className={`absolute inset-y-0 end-0 w-full origin-right rounded-full ${tone.fill}`}
               style={{ scaleX: ratio }}
            />

            {/* A soft sheen that travels the bar once, so the motion reads as the
                stock being counted rather than as a rectangle growing. */}
            {!prefersReduced ? (
               <motion.span
                  initial={{ insetInlineStart: "100%", opacity: 0.5 }}
                  animate={{ insetInlineStart: "-20%", opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
                  className="absolute inset-y-0 w-1/4 bg-linear-to-l from-transparent via-white/40 to-transparent"
                  aria-hidden="true"
               />
            ) : null}
         </span>
      </span>
   )
}