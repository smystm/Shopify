"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import type { AdminProduct } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The item artwork.
 *
 * One hero, because there is one image per item: the catalogue keeps a single
 * artwork per subcategory rather than per-copy photography, so a gallery with
 * thumbnails would be showing the same file several times and pretending
 * otherwise. The hover lift and the glow do the work a second image would.
 */
export default function ItemGallery({ product }: { product: AdminProduct }) {
   const prefersReduced = useReducedMotion()

   return (
      <motion.div
         initial={prefersReduced ? false : { opacity: 0, scale: prefersReduced ? 1 : 0.94 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
         className="relative"
      >
         <div
            aria-hidden="true"
            className="animate-shimmer pointer-events-none absolute inset-8 rounded-full bg-brand-400/25 blur-[80px] dark:bg-brand-500/15"
         />

         <div className="group relative overflow-hidden rounded-3xl border-2 border-brand-500/25 bg-surface p-4 shadow-2xl shadow-brand-500/5 transition-all duration-500 hover:border-brand-500/50 hover:shadow-[0_28px_70px_-24px] hover:shadow-brand-500/25">
            {/* The same grid texture the hero cards use, so the item sits in the
                shop's visual language rather than on a plain grey field. */}
            <span aria-hidden="true" className="hero-card-grid pointer-events-none absolute inset-0 opacity-40" />

            {/* A cool wash under the artwork: real CS2 items are lit from above,
                and a soft floor gradient is what stops them looking like stickers. */}
            <span
               aria-hidden="true"
               className="pointer-events-none absolute inset-x-8 bottom-6 h-24 rounded-[50%] bg-navy-900/25 blur-2xl transition-all duration-700 group-hover:scale-x-110 group-hover:opacity-80 dark:bg-black/40"
            />

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-navy-100/70 transition-colors duration-500 group-hover:bg-navy-50 dark:group-hover:bg-navy-950 dark:bg-navy-950/60">
               {product.image ? (
                  <Image
                     src={product.image}
                     alt={product.title}
                     fill
                     priority
                     sizes="(max-width: 1024px) 100vw, 50vw"
                     className="object-contain p-10 drop-shadow-2xl transition-all duration-700 ease-out motion-safe:group-hover:scale-[1.07] motion-safe:group-hover:-rotate-1 motion-safe:group-hover:-translate-y-1"
                     unoptimized
                  />
               ) : (
                  <div className="flex h-full items-center justify-center text-sm text-navy-500 dark:text-navy-400">
                     {fa.products.generalCategory}
                  </div>
               )}
            </div>

            {/* Corner tick marks that draw themselves in on hover - small, and
                enough to make the frame feel like it is being inspected. */}
            {(["-top-2 -start-2 border-t border-s", "-top-2 -end-2 border-t border-e", "-bottom-2 -start-2 border-b border-s", "-bottom-2 -end-2 border-b border-e"] as const).map(
               (position) => (
                  <span
                     key={position}
                     aria-hidden="true"
                     className={`pointer-events-none absolute h-5 w-5 opacity-0 transition-all duration-500 group-hover:opacity-100 ${position} border-brand-500/70`}
                  />
               )
            )}

            <span className="absolute -inset-e-4 top-4 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-brand-900/25 transition-transform duration-300 hover:scale-105 pl-5">
               {product.category?.value ?? fa.products.generalCategory}
            </span>
         </div>
      </motion.div>
   )
}