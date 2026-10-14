"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { motion, animate, useReducedMotion } from "motion/react"

interface StatCardProps {
   icon: ReactNode
   /**
    * A number counts up, a string renders as-is, and `null` renders a
    * placeholder — so "not loaded yet" never masquerades as a real zero.
    */
   value: number | string | null
   label: string
   hint?: string
   className?: string
}

const formatNumber = (n: number) => Math.round(n).toLocaleString("fa-IR")

export default function StatCard({ icon, value, label, hint, className = "" }: StatCardProps) {
   const prefersReduced = useReducedMotion()
   const numeric = typeof value === "number"
   const [display, setDisplay] = useState(0)

   useEffect(() => {
      if (!numeric || value === null || prefersReduced) return

      // animate(from, to, { onUpdate }) — the callback fires during the
      // animation rather than synchronously in the effect body, so this never
      // trips react-hooks/set-state-in-effect.
      const controls = animate(0, value, {
         duration: 1.1,
         ease: "easeOut",
         onUpdate: (latest: number) => setDisplay(latest),
         onComplete: () => setDisplay(value),
      })

      return () => controls.stop()
   }, [numeric, value, prefersReduced])

   // Reduced motion skips straight to the final figure.
   const shown = prefersReduced ? value : display

   return (
      <motion.div
         whileHover={prefersReduced ? undefined : { y: -6 }}
         transition={{ type: "spring", stiffness: 300, damping: 22 }}
         className={`group relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-5 shadow-md shadow-navy-900/5 transition-colors duration-300 hover:border-brand-400 ${className}`}
      >
         <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-e-12 -top-12 h-32 w-32 rounded-full bg-brand-400/15 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
         />

         <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110">
            {icon}
         </span>

         <div className="relative mt-4 flex items-baseline gap-2">
            {value === null ? (
               // Placeholder while the endpoint is in flight or unavailable.
               <span aria-hidden="true" className="inline-block h-7 w-14 animate-pulse rounded-lg bg-navy-200 dark:bg-navy-800" />
            ) : (
               <span className="text-2xl font-extrabold text-navy-950 dark:text-white tabular-nums">
                  {numeric ? formatNumber(shown as number) : value}
               </span>
            )}
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">{label}</span>
         </div>

         {hint ? <p className="relative mt-1 text-xs leading-5 text-navy-500 dark:text-navy-400">{hint}</p> : null}
      </motion.div>
   )
}