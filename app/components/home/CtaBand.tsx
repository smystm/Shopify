"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon, BoltIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "@/app/components/ui/Reveal"

interface CtaBandProps {
   isSignedIn: boolean
}

export default function CtaBand({ isSignedIn }: CtaBandProps) {
   const prefersReduced = useReducedMotion()

   return (
      <section className="py-10">
         <Reveal>
            <motion.div
               whileHover={prefersReduced ? undefined : { scale: 1.01 }}
               transition={{ type: "spring", stiffness: 260, damping: 26 }}
               className="relative overflow-hidden rounded-3xl border border-brand-400/20 bg-linear-to-bl from-navy-900 via-navy-950 to-navy-900 px-8 py-14 text-center shadow-2xl shadow-navy-900/20"
            >
               <div className="pointer-events-none absolute -inset-e-20 -top-20 h-64 w-64 rounded-full bg-brand-500/25 blur-[90px]" />
               <div className="pointer-events-none absolute -bottom-24 -inset-s-16 h-64 w-64 rounded-full bg-accent-500/20 blur-[90px]" />

               <div className="relative z-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{fa.home.finalCta.title}</h2>
                  <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-navy-300">{fa.home.finalCta.subtitle}</p>

                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                     <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 rounded-full bg-linear-to-l from-brand-500 to-brand-400 px-7 py-3.5 text-sm font-bold text-navy-950 shadow-lg shadow-brand-500/25 transition hover:shadow-xl hover:shadow-brand-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                     >
                        {fa.home.finalCta.primary}
                        <ArrowLeftIcon
                           className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                           aria-hidden="true"
                        />
                     </Link>

                     {isSignedIn ? (
                        <Link
                           href="/panel"
                           className="inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-accent-400/10 px-7 py-3.5 text-sm font-bold text-accent-300 transition hover:bg-accent-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
                        >
                           <BoltIcon className="h-4 w-4" aria-hidden="true" />
                           {fa.home.finalCta.panel}
                        </Link>
                     ) : (
                        <Link
                           href="/register"
                           className="inline-flex items-center gap-2 rounded-full border border-navy-600 px-7 py-3.5 text-sm font-bold text-navy-100 transition hover:border-brand-400 hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                        >
                           {fa.home.finalCta.secondary}
                        </Link>
                     )}
                  </div>
               </div>
            </motion.div>
         </Reveal>
      </section>
   )
}