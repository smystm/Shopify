"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

interface RevealProps {
   children: ReactNode
   className?: string
   /** Stagger offset in seconds. */
   delay?: number
   /** Travel distance in px along Y. Direction-neutral, so safe in RTL. */
   distance?: number
   as?: "div" | "section" | "li" | "article" | "header"
}

/**
 * Scroll-triggered fade/slide reveal.
 * Animates opacity + Y only — never X — so it behaves identically in RTL and LTR.
 */
export default function Reveal({ children, className, delay = 0, distance = 26, as = "div" }: RevealProps) {
   const prefersReduced = useReducedMotion()
   const MotionTag = motion[as]

   return (
      <MotionTag
         className={className}
         initial={{ opacity: 0, y: prefersReduced ? 0 : distance }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-80px" }}
         transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
         {children}
      </MotionTag>
   )
}