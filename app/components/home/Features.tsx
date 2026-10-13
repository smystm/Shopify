"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ComponentType, SVGProps } from "react"
import { BanknotesIcon, BoltIcon, CheckBadgeIcon, LifebuoyIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "./Reveal"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

const ITEMS: Array<{ key: keyof typeof fa.home.features.items; Icon: IconType }> = [
   { key: "authentic", Icon: CheckBadgeIcon },
   { key: "fairPrice", Icon: BanknotesIcon },
   { key: "instantDelivery", Icon: BoltIcon },
   { key: "support", Icon: LifebuoyIcon },
]

export default function Features() {
   const prefersReduced = useReducedMotion()

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.features.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.features.subtitle}</p>
         </Reveal>

         <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map(({ key, Icon }, i) => (
               <Reveal key={key} delay={i * 0.08}>
                  <motion.div
                     whileHover={prefersReduced ? undefined : { y: -6 }}
                     transition={{ type: "spring", stiffness: 320, damping: 24 }}
                     className="group h-full rounded-2xl border border-navy-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition-colors hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-500/5 dark:border-navy-700/60 dark:bg-navy-900/40 dark:hover:border-brand-400/40"
                  >
                     <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                     </span>
                     <h3 className="mt-5 text-base font-bold text-navy-900 dark:text-white">
                        {fa.home.features.items[key].title}
                     </h3>
                     <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-300">
                        {fa.home.features.items[key].body}
                     </p>
                  </motion.div>
               </Reveal>
            ))}
         </div>
      </section>
   )
}