"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "./Reveal"

export default function CategoriesShowcase() {
   const prefersReduced = useReducedMotion()

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.categories.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.categories.subtitle}</p>
         </Reveal>

         <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {fa.home.categories.items.map((item, i) => (
               <Reveal key={item.slug} delay={i * 0.05}>
                  <motion.div
                     whileHover={prefersReduced ? undefined : { y: -8 }}
                     transition={{ type: "spring", stiffness: 320, damping: 22 }}
                     className="group relative overflow-hidden rounded-2xl border border-navy-200/70 bg-white/70 p-4 shadow-sm transition-colors hover:border-brand-400/60 hover:shadow-2xl hover:shadow-brand-500/10 dark:border-navy-700/60 dark:bg-navy-900/40 dark:hover:border-brand-400/40"
                  >
                     {/* Brand wash on hover */}
                     <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                     <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-100/70 dark:bg-navy-950/60">
                        <Image
                           src={`/images/weapons-real/skins/${item.slug}/${item.slug}-0001.png`}
                           alt={item.label}
                           fill
                           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                           className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                           unoptimized
                        />
                     </div>

                     <div className="relative mt-3 flex items-center justify-center gap-1 text-sm font-bold text-navy-800 dark:text-navy-100">
                        {item.label}
                        <ArrowLeftIcon className="h-3.5 w-3.5 text-brand-500 opacity-0 transition-all duration-300 group-hover:opacity-100 rtl:scale-x-[-1]" aria-hidden="true" />
                     </div>
                  </motion.div>
               </Reveal>
            ))}
         </div>

         <Reveal delay={0.15} className="mt-10 flex justify-center">
            <Link
               href="/products"
               className="group inline-flex items-center gap-2 rounded-full border border-brand-400/50 bg-white/70 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-400/30 dark:bg-navy-900/50 dark:text-brand-300 dark:hover:bg-brand-500 dark:hover:text-white"
            >
               {fa.home.categories.cta}
               <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
         </Reveal>
      </section>
   )
}