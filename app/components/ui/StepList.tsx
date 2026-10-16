"use client"

import type { ComponentType, SVGProps } from "react"
import { motion, useReducedMotion } from "motion/react"
import Reveal from "@/app/components/ui/Reveal"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

export interface StepItem {
   title: string
   body: string
   Icon: IconType
}

interface StepListProps {
   steps: readonly StepItem[]
   title?: string
   subtitle?: string
   /** Steps per row on desktop. They always stack on mobile. */
   columns?: 2 | 3 | 4
   className?: string
}

/**
 * Static class maps, never built as template strings - Tailwind emits only the
 * classes it can see literally, so `lg:grid-cols-${n}` would compile to nothing.
 */
const COLUMNS: Record<2 | 3 | 4, { grid: string; width: string }> = {
   2: { grid: "lg:grid-cols-2", width: "max-w-3xl" },
   3: { grid: "lg:grid-cols-3", width: "max-w-4xl" },
   4: { grid: "lg:grid-cols-4", width: "max-w-5xl" },
}

/**
 * Numbered step explainer with a connector rail behind the icon tiles.
 *
 * Extracted from the home page's buy-flow section so the info guides can reuse
 * the same visual language instead of inventing a second one.
 */
export default function StepList({ steps, title, subtitle, columns = 3, className = "" }: StepListProps) {
   const prefersReduced = useReducedMotion()
   const { grid, width } = COLUMNS[columns]

   return (
      <section className={`py-16 ${className}`}>
         {title ? (
            <Reveal className="mx-auto max-w-2xl text-center">
               <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{title}</h2>
               {subtitle ? <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{subtitle}</p> : null}
            </Reveal>
         ) : null}

         <div className={`relative mx-auto mt-14 ${width}`}>
            {/* Connector rail (desktop only) - a single row, so one line joins them. */}
            <div
               aria-hidden="true"
               className="absolute inset-x-0 top-7 hidden h-px bg-linear-to-l from-transparent via-navy-300/60 to-transparent lg:block dark:via-navy-600/60"
            />

            <ol className={`relative grid grid-cols-1 gap-8 lg:gap-6 ${grid}`}>
               {steps.map(({ title: stepTitle, body, Icon }, i) => (
                  <Reveal key={stepTitle} as="li" delay={i * 0.12} className="list-none text-center">
                     <motion.div
                        whileHover={prefersReduced ? undefined : { scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}
                        className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-xl shadow-brand-700/25 ring-4 ring-navy-50 dark:ring-navy-950"
                     >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute -inset-e-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-extrabold text-navy-950 shadow-lg">
                           {i + 1}
                        </span>
                     </motion.div>

                     <h3 className="mt-6 text-lg font-bold text-navy-900 dark:text-white">{stepTitle}</h3>
                     <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-navy-600 dark:text-navy-300">{body}</p>
                  </Reveal>
               ))}
            </ol>
         </div>
      </section>
   )
}
