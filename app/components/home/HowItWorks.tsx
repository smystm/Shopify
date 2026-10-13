"use client"

import { motion, useReducedMotion } from "motion/react"
import { UserPlusIcon, CursorArrowRaysIcon, BanknotesIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "./Reveal"

const STEPS = [
   { key: "register", Icon: UserPlusIcon },
   { key: "choose", Icon: CursorArrowRaysIcon },
   { key: "receive", Icon: BanknotesIcon },
] as const

export default function HowItWorks() {
   const prefersReduced = useReducedMotion()

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.howItWorks.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.howItWorks.subtitle}</p>
         </Reveal>

         <div className="relative mx-auto mt-14 max-w-4xl">
            {/* Connector line (desktop only) */}
            <div
               aria-hidden="true"
               className="absolute inset-x-0 top-7 hidden h-px bg-gradient-to-l from-transparent via-navy-300/60 to-transparent lg:block dark:via-navy-600/60"
            />

            <ol className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
               {STEPS.map(({ key, Icon }, i) => (
                  <Reveal key={key} as="li" delay={i * 0.12} className="list-none text-center">
                     <motion.div
                        whileHover={prefersReduced ? undefined : { scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}
                        className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl shadow-brand-600/25 ring-4 ring-navy-50 dark:ring-navy-950"
                     >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute -end-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-extrabold text-navy-950 shadow-lg">
                           {i + 1}
                        </span>
                     </motion.div>

                     <h3 className="mt-6 text-lg font-bold text-navy-900 dark:text-white">
                        {fa.home.howItWorks.steps[key].title}
                     </h3>
                     <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-navy-600 dark:text-navy-300">
                        {fa.home.howItWorks.steps[key].body}
                     </p>
                  </Reveal>
               ))}
            </ol>
         </div>
      </section>
   )
}