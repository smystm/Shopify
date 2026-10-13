"use client"

import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Infinite horizontal scroll of weapon classes.
 * The track is duplicated and translated by exactly -50%, so the loop is seamless.
 */
export default function Marquee() {
   const prefersReduced = useReducedMotion()
   const items = [...fa.home.categories.items, ...fa.home.categories.items]

   return (
      <section aria-label={fa.home.marquee.label} className="relative overflow-hidden py-2">
         {/* Edge fades */}
         <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-e from-navy-50 to-transparent dark:from-navy-950" />
         <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-navy-50 to-transparent dark:from-navy-950" />

         <motion.div
            className="flex w-max gap-3 py-3"
            animate={prefersReduced ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
         >
            {items.map((item, i) => (
               <span
                  key={`${item.slug}-${i}`}
                  className="shrink-0 rounded-full border border-navy-200/70 bg-white/70 px-5 py-2 text-sm font-semibold text-navy-600 dark:border-navy-700/60 dark:bg-navy-900/50 dark:text-navy-200"
               >
                  {item.label}
               </span>
            ))}
         </motion.div>
      </section>
   )
}