"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getProducts, getCategories } from "@/app/helpers/productApi"
import type { AdminProduct, Category, ProductFilterState, ProductSort } from "@/app/contracts/products"
import ProductCard from "@/app/components/products/ProductCard"
import Pagination from "@/app/components/ui/Pagination"
import ProductCategoryFilter, { type CategorySelection } from "@/app/components/products/ProductCategoryFilter"
import ProductPriceFilter, { type PanelFilterChange } from "@/app/components/products/ProductPriceFilter"
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/products"
import { fa } from "@/app/lib/i18n/fa"
import { FolderOpenIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"

const filterLabels = fa.products.filter

const PRODUCT_SORTS: ProductSort[] = ["", "price_asc", "price_desc", "best_selling"]

/** The URL is user-editable, so a hand-typed ?sort= must not become state. */
function toProductSort(value: string | null): ProductSort {
   return PRODUCT_SORTS.includes(value as ProductSort) ? (value as ProductSort) : ""
}

export default function ProductClient() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const prefersReduced = useReducedMotion()
   const pageParam = searchParams.get("page")
   const rawPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

   const selectedCategoryParam = searchParams.get("category") ?? ""
   const selectedSubcategoriesParam = selectedCategoryParam ? searchParams.getAll("subcategory") : []
   const minPriceParam = searchParams.get("minPrice") ?? ""
   const maxPriceParam = searchParams.get("maxPrice") ?? ""
   const searchParam = searchParams.get("search") ?? ""
   const sortParam = toProductSort(searchParams.get("sort"))

   const [products, setProducts] = useState<AdminProduct[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      let cancelled = false
      async function load() {
         try {
            const [data, cats] = await Promise.all([
               getProducts({
                  filters: {
                     categories: selectedCategoryParam ? [selectedCategoryParam] : [],
                     subcategories: selectedSubcategoriesParam,
                     minPrice: minPriceParam,
                     maxPrice: maxPriceParam,
                     search: searchParam,
                     sort: sortParam,
                  },
               }),
               getCategories(),
            ])
            if (!cancelled) {
               setProducts(data)
               setCategories(cats)
            }
         } catch (err) {
            console.error("Failed to fetch products:", err)
         } finally {
            if (!cancelled) setLoading(false)
         }
      }
      load()
      return () => {
         cancelled = true
      }
   }, [searchParams.toString()])

   const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE))
   const currentPage = Math.min(rawPage, totalPages)
   const startIdx = (currentPage - 1) * PRODUCTS_PAGE_SIZE
   const visible = products.slice(startIdx, startIdx + PRODUCTS_PAGE_SIZE)

   const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(page))
      router.push(`/products?${params.toString()}`)
   }

   const handleFilterChange = (next: ProductFilterState) => {
      const params = new URLSearchParams()
      if (next.selectedCategory) params.set("category", next.selectedCategory)
      next.selectedSubcategories.forEach((subcategory) => params.append("subcategory", subcategory))
      if (next.minPrice) params.set("minPrice", next.minPrice)
      if (next.maxPrice) params.set("maxPrice", next.maxPrice)
      if (next.search) params.set("search", next.search)
      if (next.sort) params.set("sort", next.sort)
      params.set("page", "1")
      // Filters refine the current view, they are not a destination, so they
      // replace rather than push. Typing a search would otherwise leave one
      // history entry per keystroke and make Back useless.
      router.replace(`/products?${params.toString()}`)
   }

   // Each filter owns one slice of the state, so merge it back over whatever
   // the URL currently says before rebuilding the query string.
   const currentFilter: ProductFilterState = {
      selectedCategory: selectedCategoryParam,
      selectedSubcategories: selectedSubcategoriesParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      search: searchParam,
      sort: sortParam,
   }
   const handleCategoryChange = (next: CategorySelection) => handleFilterChange({ ...currentFilter, ...next })
   const handlePanelChange = (next: PanelFilterChange) => handleFilterChange({ ...currentFilter, ...next })
   const clearAllFilters = () =>
      handleFilterChange({ selectedCategory: "", selectedSubcategories: [], minPrice: "", maxPrice: "", search: "", sort: "" })

   if (loading) {
      return (
         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, i) => (
               <div key={i} className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
                  <div className="aspect-square animate-pulse bg-navy-100/70 dark:bg-navy-900/50" />
                  <div className="space-y-3 p-4">
                     <div className="h-4 w-3/4 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                     <div className="h-3 w-full animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                     <div className="h-3 w-2/3 animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                  </div>
               </div>
            ))}
         </div>
      )
   }

   if (products.length === 0) {
      return (
         <>
            <div className="mb-6">
               <ProductCategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategoryParam}
                  selectedSubcategories={selectedSubcategoriesParam}
                  labels={filterLabels}
                  onChange={handleCategoryChange}
               />
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-12">
               <aside className="min-w-0 lg:sticky lg:top-24 lg:col-span-2">
                  <ProductPriceFilter
                     minPrice={minPriceParam}
                     maxPrice={maxPriceParam}
                     search={searchParam}
                     sort={sortParam}
                     labels={filterLabels}
                     onChange={handlePanelChange}
                     onClearAll={clearAllFilters}
                  />
               </aside>

               <div className="min-w-0 lg:col-span-10">
                  <div className="relative overflow-hidden rounded-2xl border border-dashed border-navy-300 bg-surface px-6 py-16 text-center dark:border-navy-700">
                     <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-e-16 -top-16 h-48 w-48 rounded-full bg-accent-400/20 blur-3xl"
                     />
                     <motion.span
                        initial={prefersReduced ? false : { scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25"
                     >
                        <FolderOpenIcon className="h-6 w-6" aria-hidden="true" />
                     </motion.span>
                     <p className="relative text-base font-bold text-navy-950 dark:text-white">{fa.products.noProductsFound}</p>
                     <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-navy-600 dark:text-navy-300">
                        {fa.products.emptyHint}
                     </p>
                     <button
                        type="button"
                        onClick={clearAllFilters}
                        className="relative mt-6 inline-flex items-center rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                     >
                        {fa.products.emptyClearFilters}
                     </button>
                  </div>
               </div>
            </div>
         </>
      )
   }

   return (
      <>
         <div className="mb-6">
            <ProductCategoryFilter
               categories={categories}
               selectedCategory={selectedCategoryParam}
               selectedSubcategories={selectedSubcategoriesParam}
               labels={filterLabels}
               onChange={handleCategoryChange}
            />
         </div>
         <div className="grid items-start gap-6 lg:grid-cols-12">
            <aside className="min-w-0 lg:sticky lg:top-24 lg:col-span-3 xl:col-span-2">
               <ProductPriceFilter
                  minPrice={minPriceParam}
                  maxPrice={maxPriceParam}
                  search={searchParam}
                  sort={sortParam}
                  labels={filterLabels}
                  onChange={handlePanelChange}
                  onClearAll={clearAllFilters}
               />
            </aside>

            <div className="min-w-0 lg:col-span-9 xl:col-span-10">
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {visible.map((product, i) => (
                     <ProductCard key={product.id} product={product} index={i} />
                  ))}
               </div>
               <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  total={products.length}
                  pageSize={PRODUCTS_PAGE_SIZE}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>
      </>
   )
}
