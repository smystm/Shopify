"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getProducts } from "@/app/helpers/productApi"
import type { AdminProduct } from "@/app/contracts/products"
import ProductCard from "@/app/components/products/ProductCard"
import ProductPagination from "@/app/components/products/ProductPagination"
import { PRODUCTS_PAGE_SIZE } from "@/app/lib/products"

export default function ProductClient() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const pageParam = searchParams.get("page")
   const rawPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

   const [products, setProducts] = useState<AdminProduct[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      let cancelled = false
      async function load() {
         try {
            const data = await getProducts()
            if (!cancelled) setProducts(data)
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
   }, [])

   const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE))
   const currentPage = Math.min(rawPage, totalPages)
   const startIdx = (currentPage - 1) * PRODUCTS_PAGE_SIZE
   const visible = products.slice(startIdx, startIdx + PRODUCTS_PAGE_SIZE)

   const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(page))
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
      return <p className="text-zinc-500">No products found.</p>
   }

   return (
      <>
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
