"use client"

import { NoSymbolIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

export default function AccessDenied() {
   // Shown when the signed-in user's permission level blocks the page.
   const prefersReduced = useReducedMotion()

   return (
      <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-surface px-6 py-14 text-center dark:border-red-900/40">
         <div aria-hidden="true" className="pointer-events-none absolute -inset-end-16 -top-16 h-48 w-48 rounded-full bg-red-400/15 blur-3xl" />
         <motion.span
            initial={prefersReduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-600/25"
         >
            <NoSymbolIcon className="h-6 w-6" aria-hidden="true" />
         </motion.span>
         <p className="relative text-base font-bold text-navy-950 dark:text-white">{fa.admin.accessDenied.title}</p>
         <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-navy-600 dark:text-navy-300">
            {fa.admin.accessDenied.body}
         </p>
      </div>
   )
}