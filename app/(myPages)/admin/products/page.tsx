"use client"

import { useMemo, useState } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"
import ProductDialog, { type ProductFormValues } from "@/app/components/admin/products/ProductDialog"
import ProductsPagination from "@/app/components/admin/products/ProductsPagination"
import ProductsTable from "@/app/components/admin/products/ProductsTable"
import {
   PRODUCTS_PAGE_SIZE,
   suggestProductNumber,
   type AdminProduct,
} from "@/app/components/admin/products/productTypes"

export default function AdminProductsPage() {
   const [products, setProducts] = useState<AdminProduct[]>([])
   const [page, setPage] = useState(1)
   const [dialogOpen, setDialogOpen] = useState(false)
   const [editing, setEditing] = useState<AdminProduct | null>(null)

   const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE))
   const safePage = Math.min(Math.max(1, page), totalPages)

   const visibleProducts = useMemo(
      () => products.slice((safePage - 1) * PRODUCTS_PAGE_SIZE, safePage * PRODUCTS_PAGE_SIZE),
      [products, safePage],
   )

   const openAddDialog = () => {
      setEditing(null)
      setDialogOpen(true)
   }

   const openEditDialog = (product: AdminProduct) => {
      setEditing(product)
      setDialogOpen(true)
   }

   const handleSave = (values: ProductFormValues) => {
      if (editing) {
         setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p)))
      } else {
         const newProduct: AdminProduct = {
            id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
            productNumber: values.productNumber,
            title: values.title,
         }
         setProducts((prev) => [...prev, newProduct])
         setPage(Math.max(1, Math.ceil((products.length + 1) / PRODUCTS_PAGE_SIZE)))
      }
      setDialogOpen(false)
      setEditing(null)
   }

   const handleDelete = (id: string) => {
      const target = products.find((p) => p.id === id)
      if (!target) return
      if (!window.confirm(`Delete "${target.title}"? This only removes it from the local list.`)) return
      const remaining = products.filter((p) => p.id !== id)
      setProducts(remaining)
      setPage((prev) => Math.min(prev, Math.max(1, Math.ceil(remaining.length / PRODUCTS_PAGE_SIZE))))
   }

   return (
      <>
         <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
               <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Products</h1>
               <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Manage your catalog. Products are stored in memory only until the backend is decided.
               </p>
            </div>
            <div className="flex items-center gap-2">
               <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  {products.length} total
               </span>
               <button
                  type="button"
                  onClick={openAddDialog}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
               >
                  <PlusIcon aria-hidden="true" className="h-5 w-5" />
                  Add Product
               </button>
            </div>
         </div>

         <div className="mt-6">
            <ProductsTable products={visibleProducts} onEdit={openEditDialog} onDelete={handleDelete} />
         </div>

         <ProductsPagination
            page={safePage}
            totalPages={totalPages}
            total={products.length}
            pageSize={PRODUCTS_PAGE_SIZE}
            onPageChange={setPage}
         />

         <ProductDialog
            open={dialogOpen}
            initial={editing}
            suggestedNumber={suggestProductNumber(products.length)}
            onClose={() => {
               setDialogOpen(false)
               setEditing(null)
            }}
            onSave={handleSave}
         />
      </>
   )
}
