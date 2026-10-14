"use client"

import { motion, useReducedMotion } from "motion/react"
import { useTheme, type Theme } from "@/app/components/ThemeProvider"
import { fa } from "@/app/lib/i18n/fa"

const LABELS: Record<Theme, string> = {
   light: fa.theme.light,
   dark: fa.theme.dark,
   system: fa.theme.system,
}

const ICONS: Record<Theme, "sun" | "moon" | "system"> = {
   light: "sun",
   dark: "moon",
   system: "system",
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
   const { theme, resolvedTheme, cycleTheme } = useTheme()
   const prefersReduced = useReducedMotion()

   const icon = ICONS[theme]
   const label = LABELS[theme]

   // The glyph reflects the resolved theme so a "system" user still sees the
   // sun or moon that is actually active.
   const active = theme === "system" ? resolvedTheme : theme
   const showSun = active === "light"

   return (
      <button
         type="button"
         onClick={cycleTheme}
         title={label}
         aria-label={`${fa.theme.toggle}: ${label}`}
         className={`group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-navy-200/70 bg-white/70 transition-colors duration-300 hover:border-brand-400 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-navy-700/60 dark:bg-navy-900/60 dark:hover:border-brand-400 dark:hover:bg-brand-500/10 ${className}`}
      >
         <motion.span
            key={icon}
            initial={prefersReduced ? false : { rotate: -70, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center"
         >
            {icon === "system" ? (
               <SystemGlyph />
            ) : showSun ? (
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent-600" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                     <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
                  </g>
               </svg>
            ) : (
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand-400" aria-hidden="true">
                  <path
                     d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z"
                     fill="currentColor"
                  />
               </svg>
            )}
         </motion.span>

         {/* "system" indicator dot */}
         {icon === "system" ? (
            <span aria-hidden="true" className="absolute inset-e-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
         ) : null}
      </button>
   )
}

/** Small half-filled circle meaning "follow the operating system". */
function SystemGlyph() {
   return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-navy-600 dark:text-navy-300" aria-hidden="true">
         <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
         <path d="M12 3.8a8.2 8.2 0 0 1 0 16.4Z" fill="currentColor" />
      </svg>
   )
}