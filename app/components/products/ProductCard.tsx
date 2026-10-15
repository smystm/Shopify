"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"

interface ProductCardProps {
   product: AdminProduct
   /** Stagger index for the grid entrance. */
   index?: number
   /** Hide the category ribbon (used inside the detail page rail). */
   compact?: boolean
}

export default function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
   const prefersReduced = useReducedMotion()

   return (
      <motion.div
         initial={{ opacity: 0, y: prefersReduced ? 0 : 26 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{
            duration: 0.5,
            delay: prefersReduced ? 0 : Math.min(index * 0.06, 0.4),
            ease: [0.22, 1, 0.36, 1],
         }}
         className="h-full"
      >
         <motion.div whileHover={prefersReduced ? undefined : { y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="h-full">
            <Link
               href={`/products/${product.id}`}
               className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-sm transition-all duration-300 hover:border-brand-400/70 hover:shadow-2xl hover:shadow-brand-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
               {/* ---------- Image stage ---------- */}
               <div className={`relative w-full overflow-hidden bg-linear-to-b from-navy-100/80 to-navy-50 dark:from-navy-950 dark:to-navy-900 ${compact ? "aspect-square" : "aspect-4/3"}`}>
                  {/* Radial spotlight that fades in on hover (behind the image). */}
                  <span
                     aria-hidden="true"
                     className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.28),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {product.image ? (
                     <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes={compact ? "(max-width: 640px) 50vw, 25vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                        className="relative object-contain p-7 drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-[1.12] group-hover:-rotate-2"
                        unoptimized
                     />
                  ) : (
                     <div className="relative flex h-full items-center justify-center text-sm text-navy-500 dark:text-navy-400">{fa.products.generalCategory}</div>
                  )}

                  {/* Category ribbon */}
                  <span className="absolute -inset-e-3 top-3 rounded-full bg-linear-to-l from-brand-700 to-brand-800 pe-5 px-3 py-1 text-[11px] font-bold text-white shadow-md shadow-brand-900/25 ring-1 ring-white/10">
                     {product.category?.value ?? fa.products.generalCategory}
                  </span>

                  {/* Bottom fade into the body */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-surface to-transparent" />
               </div>

               {/* ---------- Body ---------- */}
               <div className="relative flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-1 text-[15px] font-extrabold text-navy-950 transition-colors duration-300 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                     {product.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-navy-600 dark:text-navy-300">{product.desc}</p>

                  {/* Divider */}
                  <span aria-hidden="true" className="my-4 h-px w-full bg-border-subtle" />

                  {/* Price on its own full-width row, with the action beneath it.
                      Side by side, the "مشاهده" pill is a fixed 102px and left
                      the price only 28px inside a 183px card - the 8-digit
                      prices overflowed by ~76px. */}
                  <div className="min-w-0 flex justify-end items-center align-middle gap-1.5 ">
                     {/* dir=ltr so the grouped digits read left-to-right inside
                         the RTL card, matching the wallet and order amounts. */}
                     <div className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-lg font-extrabold text-transparent">
                        {formatToman(product.price)}
                     </div>
                     <div className="text-[11px] font-medium text-navy-500 dark:text-navy-400">{fa.products.priceLabel}</div>
                  </div>

                  <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-brand-500/25 bg-brand-50/80 px-4 py-2 text-sm font-bold text-brand-700 transition-all duration-300 group-hover:border-transparent group-hover:bg-linear-to-l group-hover:from-brand-700 group-hover:to-brand-800 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-700/30 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300 dark:group-hover:text-white">
                     {fa.products.view}
                     <ArrowLeftIcon
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:scale-x-[-1] rtl:group-hover:translate-x-0.5"
                        aria-hidden="true"
                     />
                  </span>
               </div>
            </Link>
         </motion.div>
      </motion.div>
   )
}
