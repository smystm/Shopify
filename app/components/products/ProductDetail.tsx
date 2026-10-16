"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import type { AdminProduct } from "@/app/contracts/products"
import RelatedProducts from "@/app/components/products/RelatedProducts"
import ItemGallery from "./detail/ItemGallery"
import BuyBox from "./detail/BuyBox"
import ProductBadges from "./detail/ProductBadges"
import QuickFacts from "./detail/QuickFacts"
import SpecsPanel from "./specs/SpecsPanel"
import { fa } from "@/app/lib/i18n/fa"

const TABS = [fa.products.tabs.description, fa.products.tabs.specifications, fa.products.tabs.shipping] as const

/**
 * The product page.
 *
 * Almost nothing lives here any more. The gallery, the buy box, the badges and
 * the specifications are all separate, and the one thing this component is
 * responsible for is the decision that made the page worth splitting: which
 * specification sections to show, which `SpecsPanel` works out from the item
 * itself. A case and a weapon skin go through the same code and come out looking
 * like two different pages, because one of them has a float range and the other
 * does not.
 */
export default function ProductDetail({ product }: { product: AdminProduct }) {
   const prefersReduced = useReducedMotion()
   const formatDate = (date: number | string | null | undefined): string => {
      if (!date) return fa.products.noDate
      const d = new Date(date)
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
   }

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
            <ItemGallery product={product} />

            <motion.div
               initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
               className="flex flex-col"
            >
               <h1 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{product.title}</h1>

               <ProductBadges product={product} />
               <QuickFacts product={product} />

               <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
                  {fa.products.detailsLabels.sku}: {product.productNumber}
               </p>

               <BuyBox product={product} />
            </motion.div>
         </div>

         {/* Specifications get their own full-width block rather than living in a
             tab: they are the reason to buy the right copy, and a thing you have
             to click to discover is a thing most people never see. */}
         <div className="mt-16">
            <motion.div
               initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-80px" }}
               transition={{ duration: 0.5 }}
            >
               {/* With an eyebrow and a rule, the block reads as a section of the
                    page rather than as two cards that happen to be side by side. */}
               <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border-subtle pb-4">
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                        {fa.products.specsEyebrow}
                     </p>
                     <h2 className="mt-1.5 text-xl font-extrabold text-navy-950 dark:text-white">
                        {fa.products.specsPanelTitle}
                     </h2>
                  </div>

                  {/* The item's own name beside the heading, so a reader who landed
                        here from a listing knows which item they are reading about. */}
                  <p className="max-w-xs truncate text-end text-sm font-bold text-navy-500 dark:text-navy-400">
                     {product.title}
                  </p>
               </div>

               <SpecsPanel product={product} />
            </motion.div>
         </div>

         {/* ------------------------------------------------------------- Tabs */}
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
                           `relative flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-300 focus:outline-none ${
                              selected ? "text-white" : "text-navy-600 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300"
                           }`
                        }
                     >
                        {({ selected }) => (
                           <>
                              {selected ? (
                                 <motion.span
                                    layoutId="product-tab-pill"
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 rounded-xl bg-linear-to-l from-brand-700 to-brand-800 shadow-md shadow-brand-700/25"
                                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
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
                           {
                              label: fa.products.detailsLabels.category,
                              value: product.category?.value ?? fa.products.generalCategory,
                           },
                           { label: fa.products.detailsLabels.price, value: product.price },
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