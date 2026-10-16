"use client"

import type { ComponentType, SVGProps, ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import Reveal from "@/app/components/ui/Reveal"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

export interface CardGridItem {
   title: string
   body: string
   Icon?: IconType
   /** Shown instead of an icon - used for numbered or emoji-free callouts. */
   badge?: ReactNode
}

interface CardGridProps {
   items: readonly CardGridItem[]
   columns?: 2 | 3 | 4
   className?: string
}

const COLUMNS: Record<2 | 3 | 4, string> = {
   2: "sm:grid-cols-2",
   3: "sm:grid-cols-2 lg:grid-cols-3",
   4: "sm:grid-cols-2 lg:grid-cols-4",
}

/**
 * Responsive grid of titled cards, used for the "values", "why" and support
 * channel sections.
 *
 * The hover lift is the same spring the product and category cards use, so the
 * info pages feel like the rest of the site rather than a separate reading area.
 */
export default function CardGrid({ items, columns = 3, className = "" }: CardGridProps) {
   const prefersReduced = useReducedMotion()

   return (
      <div className={`grid grid-cols-1 gap-5 ${COLUMNS[columns]} ${className}`}>
         {items.map(({ title, body, Icon, badge }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
               <motion.article
                  whileHover={prefersReduced ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group flex h-full flex-col rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/5 dark:hover:border-brand-400/40"
               >
                  {Icon ? (
                     <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                     </span>
                  ) : null}

                  {badge ? (
                     <span className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-base font-extrabold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        {badge}
                     </span>
                  ) : null}

                  <h3 className="mt-5 text-base font-bold text-navy-900 first:mt-0 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-navy-600 dark:text-navy-300">{body}</p>
               </motion.article>
            </Reveal>
         ))}
      </div>
   )
}
