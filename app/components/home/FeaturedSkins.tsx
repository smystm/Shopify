"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"
import { hasImage } from "@/app/lib/catalog"
import type { ProductWithImage } from "@/app/lib/catalog"
import Reveal from "@/app/components/ui/Reveal"
import Carousel, { CAROUSEL_SLIDE_CLASS } from "@/app/components/ui/Carousel"

const SLIDES = { base: 1, sm: 2, lg: 4 }

/** How many of the newest products the carousel holds. */
const FEATURED_COUNT = 12

export default function FeaturedSkins({ products, loading }: { products: AdminProduct[]; loading?: boolean }) {
   const prefersReduced = useReducedMotion()
   // `products` already arrives newest-first from HomeClient. Every current row
   // has an image, but the column is nullable, and a card with no artwork would
   // render as an empty box - so those rows are simply not shown here.
   const featured = products.filter(hasImage).slice(0, FEATURED_COUNT)

   // `null` keeps a placeholder slide in the track while data loads.
   const slides: (ProductWithImage | null)[] = loading ? Array.from({ length: 4 }, () => null) : featured

   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.featured.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.featured.subtitle}</p>
         </Reveal>

         {!loading && featured.length === 0 ? (
            <p className="mt-12 text-center text-sm text-navy-500 dark:text-navy-400">{fa.home.featured.empty}</p>
         ) : (
            <div className="mt-12">
               <Carousel slidesPerView={SLIDES} gap={24}>
                  {slides.map((product, i) => (
                     <div key={product ? product.id : `skeleton-${i}`} className={`pt-3 ${CAROUSEL_SLIDE_CLASS}`}>
                        {product ? (
                           <motion.div
                              whileHover={prefersReduced ? undefined : { y: -10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 22 }}
                              className="h-full"
                           >
                              <Link
                                 href={`/products/${product.id}`}
                                 className="group block h-full overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400 hover:shadow-2xl hover:shadow-brand-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:hover:border-brand-400/40"
                              >
                                 <div className="relative aspect-4/3 overflow-hidden bg-navy-100/70 dark:bg-navy-950/60">
                                    <Image
                                       src={product.image}
                                       alt={product.title}
                                       fill
                                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                       className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                       unoptimized
                                    />
                                    <span className="absolute inset-e-3 top-3 rounded-full bg-brand-500/90 px-3 py-1 text-[11px] font-bold text-white">
                                       {fa.home.featured.newestTag}
                                    </span>
                                 </div>

                                 <div className="p-5">
                                    <h3 className="truncate text-sm font-bold text-navy-900 dark:text-white">{product.title}</h3>
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                       <div className="min-w-0">
                                          <div className="text-[11px] font-medium text-navy-500 dark:text-navy-400">{fa.home.featured.priceLabel}</div>
                                          <div dir="ltr" className="text-lg font-extrabold text-brand-700 dark:text-brand-300">
                                             {formatToman(product.price)}
                                          </div>
                                       </div>
                                       <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white transition group-hover:bg-brand-600 dark:bg-white dark:text-navy-900 dark:group-hover:bg-brand-500">
                                          <ArrowLeftIcon className="h-4 w-4 rtl:scale-x-[-1]" aria-hidden="true" />
                                          <span className="sr-only">{product.title}</span>
                                       </span>
                                    </div>
                                 </div>
                              </Link>
                           </motion.div>
                        ) : (
                           <div className="animate-pulse h-full rounded-2xl border border-border-strong bg-surface">
                              <div className="aspect-4/3 bg-navy-100 dark:bg-navy-900" />
                              <div className="space-y-2 p-5">
                                 <div className="h-4 w-3/4 rounded bg-navy-100 dark:bg-navy-900" />
                                 <div className="h-5 w-1/3 rounded bg-navy-100 dark:bg-navy-900" />
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </Carousel>
            </div>
         )}
      </section>
   )
}
