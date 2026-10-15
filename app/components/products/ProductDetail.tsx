"use client"

import { useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import {
   MinusIcon,
   PlusIcon,
   ShoppingCartIcon,
   TruckIcon,
   ShieldCheckIcon,
   ArrowLeftIcon,
   ArrowRightIcon,
   CheckIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import type { AdminProduct } from "@/app/contracts/products"
import RelatedProducts from "@/app/components/products/RelatedProducts"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"

interface ProductDetailProps {
   product: AdminProduct
}

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

const TABS = [
   fa.products.tabs.description,
   fa.products.tabs.details,
   fa.products.tabs.shipping,
] as const

export default function ProductDetail({ product }: ProductDetailProps) {
   const [quantity, setQuantity] = useState(1)
   const [added, setAdded] = useState(false)
   const prefersReduced = useReducedMotion()

   const handleAddToCart = () => {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
   }

   const formatDate = (date: number | string | null | undefined): string => {
      if (!date) return fa.products.noDate
      const d = new Date(date)
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
   }

   const stepButton =
      "flex h-10 w-10 items-center justify-center rounded-full border border-navy-300 text-navy-600 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 dark:border-navy-700 dark:text-navy-300 dark:hover:border-brand-400 dark:hover:bg-brand-500/10"

   return (
      <div className="mx-auto max-w-7xl">
         <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
         >
            <Link
               href="/products"
               className="group mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-navy-600 transition-colors hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300"
            >
               <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:hidden rtl:group-hover:translate-x-1" aria-hidden="true" />
               <ArrowRightIcon className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:block rtl:group-hover:-translate-x-1" aria-hidden="true" />
               {fa.products.backToProducts}
            </Link>
         </motion.div>

         <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* ---------- Gallery ---------- */}
            <motion.div
               initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.94 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
               className="relative"
            >
               <div
                  aria-hidden="true"
                  className="animate-shimmer pointer-events-none absolute inset-8 rounded-full bg-brand-400/25 blur-[80px] dark:bg-brand-500/15"
               />
               <div className="relative overflow-hidden rounded-3xl border-2 border-brand-500/25 bg-surface p-4 shadow-2xl shadow-brand-500/5">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-navy-100/70 dark:bg-navy-950/60">
                     {product.image ? (
                        <Image
                           src={product.image}
                           alt={product.title}
                           fill
                           priority
                           sizes="(max-width: 1024px) 100vw, 50vw"
                           className="object-contain p-10 drop-shadow-2xl"
                           unoptimized
                        />
                     ) : (
                        <div className="flex h-full items-center justify-center text-sm text-navy-500 dark:text-navy-400">
                           {fa.products.generalCategory}
                        </div>
                     )}
                  </div>
                  <span className="absolute -inset-e-4 top-4 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-brand-900/25">
                     {product.category?.value ?? fa.products.generalCategory}
                  </span>
               </div>
            </motion.div>

            {/* ---------- Buy box ---------- */}
            <motion.div
               initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
               className="flex flex-col"
            >
               <h1 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{product.title}</h1>

               <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
                  {fa.products.detailsLabels.sku}: {product.productNumber}
               </p>

               <p className="mt-4 flex items-baseline gap-2">
                  <span dir="ltr" className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-4xl font-extrabold text-transparent">
                     {formatToman(product.price)}
                  </span>
                  {/* The one surface with no adjacent label to carry the unit,
                      so it is spelled out beside the amount. */}
                  <span className="text-lg font-bold text-navy-500 dark:text-navy-400">{fa.currency}</span>
               </p>

               <p className="mt-4 text-base leading-7 text-navy-600 dark:text-navy-300">{product.desc}</p>

               {/* Quantity */}
               <div className="mt-8">
                  <label htmlFor="quantity" className="text-sm font-bold text-navy-800 dark:text-navy-100">
                     {fa.products.quantity}
                  </label>
                  <div className="mt-2.5 flex items-center gap-3">
                     <button
                        type="button"
                        aria-label={fa.products.quantityDecrease}
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={stepButton}
                     >
                        <MinusIcon className="h-4 w-4" aria-hidden="true" />
                     </button>
                     <input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-11 w-20 rounded-xl border border-navy-300 bg-surface text-center text-sm font-bold text-navy-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                     />
                     <button
                        type="button"
                        aria-label={fa.products.quantityIncrease}
                        onClick={() => setQuantity(quantity + 1)}
                        className={stepButton}
                     >
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                     </button>
                  </div>
               </div>

               {/* Add to cart */}
               <div className="mt-6">
                  {/* `group` lives on the button so the shine is driven by the
                      button's hover, not the (unreachable) translated span. */}
                  <motion.button
                     type="button"
                     onClick={handleAddToCart}
                     whileHover={prefersReduced ? undefined : { y: -2 }}
                     whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 320, damping: 22 }}
                     className={classNames(
                        "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
                        added
                           ? "bg-emerald-700 shadow-xl shadow-emerald-800/30"
                           : "bg-linear-to-l from-brand-700 to-brand-800 shadow-lg shadow-brand-700/30 hover:shadow-xl hover:shadow-brand-700/45",
                     )}
                  >
                     {!added ? (
                        /* Sits behind the label (-z-10) so it can never wash out
                           the text, and is driven by the button's hover via group. */
                        <span
                           aria-hidden="true"
                           className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                        />
                     ) : null}
                     {added ? (
                        <motion.span
                           initial={prefersReduced ? false : { scale: 0, rotate: -45 }}
                           animate={{ scale: 1, rotate: 0 }}
                           transition={{ type: "spring", stiffness: 500, damping: 18 }}
                           className="relative z-10"
                        >
                           <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </motion.span>
                     ) : (
                        <ShoppingCartIcon className="relative z-10 h-5 w-5" aria-hidden="true" />
                     )}
                     <span className="relative z-10">{added ? fa.products.addedToCart : fa.products.addToCart}</span>
                  </motion.button>
               </div>

               {/* Trust row */}
               <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 transition-colors hover:border-brand-400/50">
                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-400">
                        <TruckIcon className="h-5 w-5" aria-hidden="true" />
                     </span>
                     <span className="text-xs font-semibold leading-5 text-navy-700 dark:text-navy-200">{fa.products.freeShipping}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 transition-colors hover:border-accent-400/60">
                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/20 text-accent-700 dark:text-accent-400">
                        <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
                     </span>
                     <span className="text-xs font-semibold leading-5 text-navy-700 dark:text-navy-200">{fa.products.returnPolicy}</span>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* ---------- Tabs ---------- */}
         <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-16"
         >
            <TabGroup>
               <TabList className="flex flex-wrap gap-1 rounded-2xl border border-border-subtle bg-surface p-1.5">
                  {TABS.map((tab) => (
                     <Tab
                        key={tab}
                        className={({ selected }) =>
                           classNames(
                              "relative flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-300 focus:outline-none",
                              selected ? "text-white" : "text-navy-600 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300",
                           )
                        }
                     >
                        {({ selected }) => (
                           <>
                              {selected ? (
                                 <motion.span
                                    layoutId="product-tab-pill"
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 rounded-xl bg-linear-to-l from-brand-700 to-brand-800 shadow-md shadow-brand-700/25"
                                    transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                                 />
                              ) : null}
                              <span className="relative">{tab}</span>
                           </>
                        )}
                     </Tab>
                  ))}
               </TabList>

               <TabPanels className="mt-6">
                  <TabPanel className="rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
                     <p className="text-base leading-7 text-navy-600 dark:text-navy-300">{product.desc}</p>
                     <p className="mt-4 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.products.descriptionBlurb}</p>
                  </TabPanel>

                  <TabPanel className="rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
                     <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                           { label: fa.products.detailsLabels.productNumber, value: product.productNumber },
                           { label: fa.products.detailsLabels.category, value: product.category?.value ?? fa.products.generalCategory },
                           { label: fa.products.detailsLabels.price, value: formatToman(product.price) },
                           { label: fa.products.detailsLabels.created, value: formatDate(product.created_at) },
                        ].map((row) => (
                           <div key={row.label} className="rounded-2xl border border-border-subtle bg-surface-muted p-4">
                              <dt className="text-xs font-bold uppercase tracking-wide text-navy-600 dark:text-navy-300">{row.label}</dt>
                              <dd className="mt-1.5 text-sm font-bold text-navy-950 dark:text-white">{row.value}</dd>
                           </div>
                        ))}
                     </dl>
                  </TabPanel>

                  <TabPanel className="rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
                     <div className="space-y-5">
                        {[
                           { title: fa.products.shipping.infoTitle, body: fa.products.shipping.infoBody },
                           { title: fa.products.shipping.estimateTitle, body: fa.products.shipping.estimateBody },
                           { title: fa.products.shipping.returnsTitle, body: fa.products.shipping.returnsBody },
                        ].map((row) => (
                           <div key={row.title} className="border-s-2 border-brand-500/40 ps-4">
                              <h3 className="text-sm font-bold text-navy-950 dark:text-white">{row.title}</h3>
                              <p className="mt-1.5 text-sm leading-6 text-navy-600 dark:text-navy-300">{row.body}</p>
                           </div>
                        ))}
                     </div>
                  </TabPanel>
               </TabPanels>
            </TabGroup>
         </motion.div>

         {/* ---------- Recommended products ---------- */}
         <RelatedProducts categoryValue={product.category?.value} currentProductId={product.id} />
      </div>
   )
}