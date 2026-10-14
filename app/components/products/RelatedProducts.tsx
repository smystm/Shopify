"use client"

import { useEffect, useState } from "react"
import { SparklesIcon } from "@heroicons/react/24/outline"
import { getProducts } from "@/app/helpers/productApi"
import type { AdminProduct } from "@/app/contracts/products"
import ProductCard from "@/app/components/products/ProductCard"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

interface RelatedProductsProps {
   /** Category value of the product currently being viewed. */
   categoryValue?: string | null
   /** Excluded from the results (the product itself). */
   currentProductId: number
   limit?: number
}

export default function RelatedProducts({ categoryValue, currentProductId, limit = 4 }: RelatedProductsProps) {
   const [products, setProducts] = useState<AdminProduct[]>([])
   const [loaded, setLoaded] = useState(false)

   // No category on the product => nothing meaningful to recommend.
   const shouldFetch = Boolean(categoryValue)
   const loading = shouldFetch && !loaded

   useEffect(() => {
      if (!shouldFetch) return
      let cancelled = false

      getProducts({ filters: { categories: [categoryValue as string] } })
         .then((data) => {
            if (cancelled) return
            setProducts(data.filter((p) => p.id !== currentProductId).slice(0, limit))
         })
         .catch(() => {
            if (!cancelled) setProducts([])
         })
         .finally(() => {
            if (!cancelled) setLoaded(true)
         })

      return () => {
         cancelled = true
      }
   }, [shouldFetch, categoryValue, currentProductId, limit])

   // Nothing to show (still loading, no category, or no results).
   if (loading) {
      return (
         <section className="mt-16">
            <div className="mb-6 flex items-center gap-2.5">
               <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25">
                  <SparklesIcon className="h-5 w-5" aria-hidden="true" />
               </span>
               <h2 className="text-xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.products.relatedTitle}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {Array.from({ length: limit }).map((_, i) => (
                  <div
                     key={i}
                     className="overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-sm"
                  >
                     <div className="aspect-4/3 animate-pulse bg-navy-100/70 dark:bg-navy-900/50" />
                     <div className="space-y-3 p-5">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                        <div className="h-3 w-full animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                        <div className="h-6 w-24 animate-pulse rounded bg-brand-500/20" />
                     </div>
                  </div>
               ))}
            </div>
         </section>
      )
   }

   if (products.length === 0) return null

   return (
      <section className="mt-16">
         <Reveal className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25">
               <SparklesIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
               <h2 className="text-xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.products.relatedTitle}</h2>
               <p className="text-sm text-navy-500 dark:text-navy-400">{fa.products.relatedSubtitle}</p>
            </div>
         </Reveal>

         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
               <ProductCard key={product.id} product={product} index={i} compact />
            ))}
         </div>
      </section>
   )
}