"use client"

import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

interface YokosoProps {
   paraKoso?: string,
   headKoso: string
}

/**
 * Brand lockup above an auth card: gradient bag tile, wordmark, subtitle.
 * No `tracking-tight` — letter-spacing breaks up the joins in Arabic script.
 */
export default function Yokoso({ paraKoso, headKoso }: YokosoProps) {
   const prefersReduced = useReducedMotion()

   return (
      <div className="mb-8 flex flex-col items-center text-center">
         <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : -18, scale: prefersReduced ? 1 : 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 shadow-xl shadow-brand-700/30"
         >
            {/* Shine sweep */}
            <span
               aria-hidden="true"
               className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
            />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
               <path d="M5 8h14l1 13H4L5 8Z" fill="white" />
               <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
         </motion.div>

         <motion.h1
            initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-3xl font-extrabold leading-tight text-navy-950 dark:text-white"
         >
            {headKoso ? headKoso : fa.header.brand}
         </motion.h1>

         {paraKoso ? (
            <motion.p
               initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
               className="mt-3 max-w-sm text-[15px] leading-7 text-navy-600 dark:text-navy-300"
            >
               {paraKoso}
            </motion.p>
         ) : null}
      </div>
   )
}