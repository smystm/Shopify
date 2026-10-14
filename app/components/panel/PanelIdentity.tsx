"use client"

import { useSyncExternalStore } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ShieldCheckIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"

/* ---------------------------------------------------------------- greeting */

function greetingForHour(hour: number): string {
   if (hour >= 5 && hour < 12) return fa.panel.greeting.morning
   if (hour >= 12 && hour < 17) return fa.panel.greeting.noon
   if (hour >= 17 && hour < 21) return fa.panel.greeting.afternoon
   return fa.panel.greeting.evening
}

// The clock is unknown on the server. The "" server snapshot keeps SSR and
// hydration consistent, then React swaps in the real value immediately —
// without a setState-in-effect.
const noopSubscribe = () => () => {}
const readGreeting = () => greetingForHour(new Date().getHours())
const serverGreeting = () => ""

export function usePersianGreeting(): string {
   return useSyncExternalStore(noopSubscribe, readGreeting, serverGreeting)
}

/* ------------------------------------------------------------------ avatar */

/** First grapheme of the display name — Persian names are not ASCII. */
function initialOf(name: string): string {
   const trimmed = name.trim()
   return trimmed ? Array.from(trimmed)[0] : "؟"
}

/** Gradient monogram tile. White on brand-700/800 passes at 5.47 / 7.58. */
export function AvatarTile({ name }: { name: string }) {
   const prefersReduced = useReducedMotion()

   return (
      <motion.div
         initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.7 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ type: "spring", stiffness: 260, damping: 20, delay: prefersReduced ? 0 : 0.1 }}
         className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 to-brand-800 text-3xl font-extrabold text-white shadow-2xl shadow-brand-700/30"
      >
         {/* Held at /8 so the sheen peak stays above 4.5:1. */}
         <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
         />
         <span className="relative">{initialOf(name)}</span>
      </motion.div>
   )
}

/* ---------------------------------------------------------------- greeting */

/**
 * The panel's whole identity block: greeting, name, and the user's role.
 * Deliberately three elements — anything more crowds the hero.
 */
export function IdentityTitle({
   greeting,
   name,
   roleLabel,
   elevated,
}: {
   greeting: string
   name: string
   roleLabel: string
   /** Admins get the brand pill; everyone else gets a neutral one. */
   elevated: boolean
}) {
   const prefersReduced = useReducedMotion()

   return (
      <div className="min-w-0">
         <h1 className="text-3xl font-bold text-navy-950 dark:text-white md:text-4xl">
            {greeting ? (
               <motion.span
                  key={greeting}
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
               >
                  {fa.panel.greetingLine.replace("{greeting}", greeting).replace("{name}", name)}
               </motion.span>
            ) : (
               // Reserved line so the layout does not jump once the clock resolves.
               <span className="opacity-0">
                  {fa.panel.greetingLine.replace("{greeting}", fa.panel.greeting.morning).replace("{name}", name)}
               </span>
            )}
         </h1>

         <span
            className={[
               "mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold",
               elevated
                  ? "bg-linear-to-l from-brand-700 to-brand-800 text-white shadow-lg shadow-brand-700/25"
                  : "border border-border-strong bg-surface-muted text-navy-700 dark:text-navy-200",
            ].join(" ")}
         >
            {elevated ? <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" /> : null}
            {roleLabel}
         </span>
      </div>
   )
}