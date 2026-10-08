"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getProducts, getCategories } from "@/app/helpers/productApi"
import type { AdminProduct, Category } from "@/app/contracts/products"
import ProductCard from "@/app/components/products/ProductCard"
import ProductPagination from "@/app/components/products/ProductPagination"
import ProductFilter from "@/app/components/ui/ProductFilter"
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/products"

export default function ProductClient() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const pageParam = searchParams.get("page")
   const rawPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

   const selectedCategoryParam = searchParams.get("category") ?? ""
   const minPriceParam = searchParams.get("minPrice") ?? ""
   const maxPriceParam = searchParams.get("maxPrice") ?? ""

   const [products, setProducts] = useState<AdminProduct[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      let cancelled = false
      async function load() {
         try {
            const [data, cats] = await Promise.all([
               getProducts({ filters: { categories: selectedCategoryParam ? [selectedCategoryParam] : [], minPrice: minPriceParam, maxPrice: maxPriceParam } }),
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

   const handleFilterChange = (next: { selectedCategory: string; minPrice: string; maxPrice: string }) => {
      const params = new URLSearchParams()
      if (next.selectedCategory) params.set("category", next.selectedCategory)
      if (next.minPrice) params.set("minPrice", next.minPrice)
      if (next.maxPrice) params.set("maxPrice", next.maxPrice)
      params.set("page", "1")
      router.push(`/products?${params.toString()}`)
   }

   if (loading) {
      return (
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, i) => (
               <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
               />
            ))}
         </div>
      )
   }

   if (products.length === 0) {
      return (
         <>
            <div className="mb-6">
               <ProductFilter
                  categories={categories}
                  selectedCategory={selectedCategoryParam}
                  minPrice={minPriceParam}
                  maxPrice={maxPriceParam}
                  onChange={handleFilterChange}
               />
            </div>
            <p className="text-zinc-500">No products found.</p>
         </>
      )
   }

   return (
      <>
         <div className="mb-6">
            <ProductFilter
               categories={categories}
                selectedCategory={selectedCategoryParam}
               minPrice={minPriceParam}
               maxPrice={maxPriceParam}
               onChange={handleFilterChange}
            />
         </div>
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
               <ProductCard key={product.id} product={product} />
            ))}
         </div>
         <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            total={products.length}
            pageSize={PRODUCTS_PAGE_SIZE}
            onPageChange={handlePageChange}
         />
      </>
   )
}
