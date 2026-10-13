"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "./Reveal"

/**
 * Curated showcase cards backed by the real images already shipped in
 * /public/images. Content is static marketing data — the live catalog is
 * rendered separately by /products.
 */
const FEATURED = [
   { slug: "ak47", name: "AK-47 | Redline", price: "$ 380", tag: "پرفروش" },
   { slug: "awp", name: "AWP | Asiimov", price: "$ 620", tag: "محبوب" },
   { slug: "m4a1", name: "M4A1-S | Hyper Beast", price: "$ 540", tag: "جدید" },
   { slug: "deagle", name: "Deagle | Blaze", price: "$ 210", tag: "محبوب" },
] as const

export default function FeaturedSkins() {
   const prefersReduced = useReducedMotion()

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.featured.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.featured.subtitle}</p>
         </Reveal>

         <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((item, i) => (
               <Reveal key={item.slug} delay={i * 0.07}>
                  <motion.div
                     whileHover={prefersReduced ? undefined : { y: -10 }}
                     transition={{ type: "spring", stiffness: 300, damping: 22 }}
                     className="group h-full overflow-hidden rounded-2xl border border-navy-200/70 bg-white/70 shadow-sm backdrop-blur transition-colors hover:border-brand-400/60 hover:shadow-2xl hover:shadow-brand-500/10 dark:border-navy-700/60 dark:bg-navy-900/40 dark:hover:border-brand-400/40"
                  >
                     <div className="relative aspect-[4/3] overflow-hidden bg-navy-100/70 dark:bg-navy-950/60">
                        <Image
                           src={`/images/weapons-real/skins/${item.slug}/${item.slug}-0002.png`}
                           alt={item.name}
                           fill
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                           className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                           unoptimized
                        />
                        <span className="absolute end-3 top-3 rounded-full bg-brand-500/90 px-3 py-1 text-[11px] font-bold text-white">
                           {item.tag}
                        </span>
                     </div>

                     <div className="p-5">
                        <h3 className="truncate text-sm font-bold text-navy-900 dark:text-white">{item.name}</h3>
                        <div className="mt-3 flex items-center justify-between">
                           <div>
                              <div className="text-[11px] text-navy-500 dark:text-navy-400">{fa.home.featured.priceLabel}</div>
                              <div className="text-lg font-extrabold text-brand-700 dark:text-brand-300">{item.price}</div>
                           </div>
                           <Link
                              href="/products"
                              aria-label={item.name}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white transition group-hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:bg-white dark:text-navy-900 dark:group-hover:bg-brand-500"
                           >
                              <ArrowLeftIcon className="h-4 w-4 rtl:scale-x-[-1]" aria-hidden="true" />
                           </Link>
                        </div>
                     </div>
                  </motion.div>
               </Reveal>
            ))}
         </div>
      </section>
   )
}