"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

interface EmptyStateProps {
   icon: ReactNode
   title: string
   body: string
   /** Optional call-to-action button. */
   action?: { label: string; onClick: () => void }
   /** Tint of the ambient glow behind the icon. */
   tone?: "brand" | "accent"
   className?: string
}

/**
 * Shared "nothing here yet" panel. Replaces the per-feature copies that
 * previously lived in ProductsEmptyState and UsersEmptyState.
 */
export default function EmptyState({ icon, title, body, action, tone = "brand", className = "" }: EmptyStateProps) {
   const prefersReduced = useReducedMotion()

   return (
      <div
         className={`relative overflow-hidden rounded-2xl border border-dashed border-navy-300 bg-surface px-6 py-16 text-center dark:border-navy-700 ${className}`}
      >
         <div
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-end-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
               tone === "brand" ? "bg-brand-400/15" : "bg-accent-400/20"
            }`}
         />

         <motion.span
            initial={prefersReduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25"
         >
            {icon}
         </motion.span>

         <p className="relative text-base font-bold text-navy-950 dark:text-white">{title}</p>
         <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-navy-600 dark:text-navy-300">{body}</p>

         {action ? (
            <button
               type="button"
               onClick={action.onClick}
               className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
               {action.label}
            </button>
         ) : null}
      </div>
   )
}