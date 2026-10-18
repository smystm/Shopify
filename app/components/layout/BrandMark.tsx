"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

interface BrandMarkProps {
   /** Extra classes for the wrapping link. */
   className?: string
   /** Show the "BiaStore" wordmark next to the tile. */
   showWordmark?: boolean
   /** Closes the mobile drawer when the brand link is tapped. */
   onClick?: () => void
}

/**
 * The bag logo, shared by the desktop header and the mobile drawer.
 * Gradient tile + shine sweep + hover tilt.
 */
export default function BrandMark({ className, showWordmark = true, onClick }: BrandMarkProps) {
   const prefersReduced = useReducedMotion()

   return (
      <Link href="/" onClick={onClick} className={`group flex items-center gap-x-2.5 ${className ?? ""}`}>
         <motion.span
            whileHover={prefersReduced ? undefined : { rotate: -8, scale: 1.06 }}
            whileTap={prefersReduced ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-700/30"
         >
            {/* Shine sweep */}
            <span
               aria-hidden="true"
               className="absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
               <path d="M5 8h14l1 13H4L5 8Z" fill="white" />
               <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
         </motion.span>

         {showWordmark ? (
            <span className="text-base font-extrabold tracking-tight text-navy-950 dark:text-white">{fa.header.brand}</span>
         ) : null}
      </Link>
   )
}