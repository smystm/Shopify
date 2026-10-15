"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import type { AdminProduct, Category } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"
import { categoryIconClass, categoryIconStyle } from "@/app/lib/catalog"
import Reveal from "@/app/components/ui/Reveal"
import Carousel, { CAROUSEL_SLIDE_CLASS } from "@/app/components/ui/Carousel"

const SLIDES = { base: 2, sm: 3, lg: 6 }
const SKELETON_COUNT = 6

interface Tile {
   category: Category
   label: string
   /** A real product image from this category, when it has any stock. */
   image?: string
}

/**
 * A real product from each category doubles as that category's thumbnail — the
 * category directories hold no image of their own, only their subcategories do.
 * Categories with nothing in stock fall back to the glyph.
 */
function buildTiles(categories: Category[], products: AdminProduct[]): Tile[] {
   const firstImage = new Map<string, string>()
   for (const product of products) {
      const key = product.category?.value
      if (key && product.image && !firstImage.has(key)) firstImage.set(key, product.image)
   }

   return categories.map((category) => ({
      category,
      label: fa.home.categories.labels[category.value] ?? category.value,
      image: firstImage.get(category.value),
   }))
}

export default function CategoriesShowcase({ categories, products, loading }: { categories: Category[]; products: AdminProduct[]; loading?: boolean }) {
   const prefersReduced = useReducedMotion()

   // `null` is a placeholder slide, so the track keeps its width while data
   // loads instead of collapsing and then jumping.
   const slides: (Tile | null)[] = loading ? Array.from({ length: SKELETON_COUNT }, () => null) : buildTiles(categories, products)

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.categories.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.categories.subtitle}</p>
         </Reveal>

         {!loading && slides.length === 0 ? (
            <p className="mt-12 text-center text-sm text-navy-500 dark:text-navy-400">{fa.home.categories.empty}</p>
         ) : (
            <div className="mt-12">
               <Carousel slidesPerView={SLIDES} gap={16}>
                  {slides.map((tile, i) => (
                     <div key={tile ? tile.category.value : `skeleton-${i}`} className={`pt-3 ${CAROUSEL_SLIDE_CLASS}`}>
                        {tile ? (
                           <motion.div
                              whileHover={prefersReduced ? undefined : { y: -8 }}
                              transition={{ type: "spring", stiffness: 320, damping: 22 }}
                              className="h-full"
                           >
                              <Link
                                 href={`/products?category=${encodeURIComponent(tile.category.value)}`}
                                 className="group relative block h-full overflow-hidden rounded-2xl border border-border-strong bg-surface p-4 shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400 hover:shadow-2xl hover:shadow-brand-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:hover:border-brand-400/40"
                              >
                                 <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                 <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-100/70 dark:bg-navy-950/60">
                                    {tile.image ? (
                                       <Image
                                          src={tile.image}
                                          alt={tile.label}
                                          fill
                                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                                          unoptimized
                                       />
                                    ) : (
                                       <span
                                          aria-hidden="true"
                                          className={`${categoryIconClass(tile.category.value, "mx-auto h-2/3 w-2/3")} text-navy-400 dark:text-navy-500`}
                                          style={categoryIconStyle(tile.category.value)}
                                       />
                                    )}
                                 </div>

                                 <div className="relative mt-3 flex items-center justify-center gap-1 text-sm font-bold text-navy-800 dark:text-navy-100">
                                    {tile.label}
                                    <ArrowLeftIcon className="h-3.5 w-3.5 text-brand-500 opacity-0 transition-all duration-300 group-hover:opacity-100 rtl:scale-x-[-1]" aria-hidden="true" />
                                 </div>
                              </Link>
                           </motion.div>
                        ) : (
                           <div className="animate-pulse h-full rounded-2xl border border-border-strong bg-surface p-4">
                              <div className="aspect-square rounded-xl bg-navy-100 dark:bg-navy-900" />
                              <div className="mx-auto mt-3 h-4 w-2/3 rounded bg-navy-100 dark:bg-navy-900" />
                           </div>
                        )}
                     </div>
                  ))}
               </Carousel>
            </div>
         )}

         <Reveal delay={0.15} className="mt-10 flex justify-center">
            <Link
               href="/products"
               className="group inline-flex items-center gap-2 rounded-full border border-brand-400/50 bg-surface px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-400/30 dark:bg-navy-900/50 dark:text-brand-300 dark:hover:bg-brand-500 dark:hover:text-white"
            >
               {fa.home.categories.cta}
               <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
         </Reveal>
      </section>
   )
}
