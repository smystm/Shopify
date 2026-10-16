"use client"

import type { ComponentType, SVGProps } from "react"
import { motion, useReducedMotion } from "motion/react"
import Reveal from "@/app/components/ui/Reveal"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

export interface FeatureItem {
   title: string
   body: string
   Icon: IconType
}

interface FeatureGridProps {
   items: readonly FeatureItem[]
   title?: string
   subtitle?: string
   className?: string
}

/**
 * Grid of value-proposition tiles with gradient icon badges.
 *
 * Extracted from the home page so the category landing pages can show the same
 * brand promises from one source of truth, rather than a second copy of the
 * same four paragraphs drifting out of sync.
 */
export default function FeatureGrid({ items, title, subtitle, className = "" }: FeatureGridProps) {
   const prefersReduced = useReducedMotion()

   return (
      <section className={`py-16 ${className}`}>
         {title ? (
            <Reveal className="mx-auto max-w-2xl text-center">
               <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{title}</h2>
               {subtitle ? <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{subtitle}</p> : null}
            </Reveal>
         ) : null}

         <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ title: itemTitle, body, Icon }, i) => (
               <Reveal key={itemTitle} delay={i * 0.08}>
                  <motion.div
                     whileHover={prefersReduced ? undefined : { y: -6 }}
                     transition={{ type: "spring", stiffness: 320, damping: 24 }}
                     className="group h-full rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/5 dark:hover:border-brand-400/40"
                  >
                     <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                     </span>
                     <h3 className="mt-5 text-base font-bold text-navy-900 dark:text-white">{itemTitle}</h3>
                     <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-300">{body}</p>
                  </motion.div>
               </Reveal>
            ))}
         </div>
      </section>
   )
}
