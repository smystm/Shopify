"use client"

import React, { useState } from "react"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"

/**
 * The quantity control used by the product page and the cart.
 *
 * Shared on purpose: the ceiling has to be the same number in both places, and it
 * comes from the backend either way - `count` minus `sold_count` on the product
 * page, `line.limit` in the cart. If each had its own stepper they would drift,
 * and the drift would show up as a customer who could pick four and then have
 * the cart quietly show three.
 *
 * The typed value is kept as a string so the field can be cleared and retyped,
 * while the number driving the callbacks is always a clamped integer. That is the
 * same rule the TF2 keys stepper already uses.
 */
export default function QuantityStepper({
   value,
   max,
   onChange,
   disabled = false,
   size = "md",
   labels,
}: {
   value: number
   /** The most that may be selected. Always at least 1. */
   max: number
   onChange: (next: number) => void
   disabled?: boolean
   size?: "sm" | "md"
   labels: { decrease: string; increase: string }
}) {
   const prefersReduced = useReducedMotion()
   const [draft, setDraft] = useState(String(value))

   // Follow the store when it changes the quantity from elsewhere - the cart
   // replacing the line after a save, or the ceiling falling because somebody
   // bought the last copy while this page sat open.
   const [lastValue, setLastValue] = useState(value)
   if (value !== lastValue) {
      setLastValue(value)
      setDraft(String(value))
   }

   const clamp = (next: number) => Math.min(max, Math.max(1, Math.trunc(next)))

   /**
    * Derives from the previous draft, never from the rendered `value`. React
    * batches click handlers into one render, so a fast double-click would
    * otherwise have every handler read the same stale number.
    */
   const bump = (delta: number) =>
      setDraft((previous) => {
         const current = Number.parseInt(previous, 10)
         const next = clamp((Number.isFinite(current) ? current : 1) + delta)
         onChange(next)
         return String(next)
      })

   const handleDraft = (next: string) => {
      const digits = next.replace(/[^0-9]/g, "").slice(0, 3)

      if (digits === "") {
         setDraft("")
         return
      }

      setDraft(digits)
      onChange(clamp(Number.parseInt(digits, 10)))
   }

   const button = size === "sm" ? "h-9 w-9 rounded-xl" : "h-12 w-12 rounded-2xl"
   const field = size === "sm" ? "h-9 min-w-12 text-sm" : "h-14 w-24 text-2xl"
   const atCeiling = value >= max
   const atFloor = value <= 1

   return (
      <div className="flex items-center gap-3">
         <button
            type="button"
            aria-label={labels.decrease}
            disabled={disabled || atFloor}
            onClick={() => bump(-1)}
            className={`flex ${button} items-center justify-center border border-border-strong bg-surface text-navy-700 transition hover:border-brand-400/70 hover:text-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-navy-700 dark:text-navy-200 dark:hover:text-brand-300 dark:disabled:hover:border-border-strong dark:disabled:hover:text-navy-200`}
         >
            <MinusIcon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
         </button>

         <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            aria-label={labels.increase}
            value={draft}
            disabled={disabled}
            onChange={(event) => handleDraft(event.target.value)}
            onBlur={() => setDraft(String(clamp(Number.parseInt(draft, 10) || 1)))}
            className={`${field} flex items-center justify-center rounded-2xl border border-border-strong bg-surface text-center font-extrabold text-navy-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 dark:text-white`}
         />

         <motion.button
            type="button"
            aria-label={labels.increase}
            disabled={disabled || atCeiling}
            onClick={() => bump(1)}
            whileHover={prefersReduced || disabled || atCeiling ? undefined : { y: -2 }}
            whileTap={prefersReduced || disabled || atCeiling ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={`flex ${button} items-center justify-center border border-border-strong bg-surface text-navy-700 transition hover:border-brand-400/70 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-navy-700 dark:text-navy-200 dark:hover:text-brand-300 dark:disabled:hover:border-border-strong dark:disabled:hover:text-navy-200`}
         >
            <PlusIcon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
         </motion.button>
      </div>
   )
}