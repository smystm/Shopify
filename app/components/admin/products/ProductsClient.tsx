"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/outline"
import ProductDialog, { type ProductFormValues } from "./ProductDialog"
import ProductsPagination from "./ProductsPagination"
import ProductsTable from "./ProductsTable"
import type { AdminProduct } from "@/app/contracts/products"
import { PRODUCTS_PAGE_SIZE, suggestProductNumber } from "@/app/lib/products"
import { createProduct, updateProduct, deleteProduct } from "@/app/helpers/productApi"

interface ProductsClientProps {
    initialProducts: AdminProduct[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<AdminProduct[]>(initialProducts)
    const [page, setPage] = useState(1)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const createModal = searchParams.get("create") === "true"
    const editId = searchParams.get("edit")
    const editing = editId ? products.find((p) => p.id === Number(editId)) ?? null : null

    const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const visibleProducts = useMemo(
        () => products.slice((safePage - 1) * PRODUCTS_PAGE_SIZE, safePage * PRODUCTS_PAGE_SIZE),
        [products, safePage],
    )

    const dialogOpen = createModal || !!editing

    const openAddDialog = () => {
        router.push("/admin/products?create=true", { scroll: false })
    }

    const openEditDialog = (product: AdminProduct) => {
        router.push(`/admin/products?edit=${product.id}`, { scroll: false })
    }

    const closeDialog = () => {
        router.push("/admin/products", { scroll: false })
    }

    const handleSave = async (values: ProductFormValues) => {
        setSaving(true)
        setSaveError(null)

        try {
            if (editing) {
                const updated = await updateProduct(editing.id, {
                    productNumber: values.productNumber,
                    title: values.title,
                })
                setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)))
            } else {
                const created = await createProduct({
                    productNumber: values.productNumber,
                    title: values.title,
                })
                setProducts((prev) => [created, ...prev])
                setPage(1)
            }
            closeDialog()
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err)
            setSaveError(`Failed to save product: ${reason}`)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        const target = products.find((p) => p.id === id)
        if (!target) return
        if (!window.confirm(`Delete "${target.title}"? This will permanently remove it.`)) return

        try {
            await deleteProduct(id)
            const remaining = products.filter((p) => p.id !== id)
            setProducts(remaining)
            setPage((prev) => Math.min(prev, Math.max(1, Math.ceil(remaining.length / PRODUCTS_PAGE_SIZE))))
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err)
            window.alert(`Failed to delete product: ${reason}`)
        }
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Products</h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your catalog. Products are stored in the backend.
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

            {dialogOpen && (
                <ProductDialog
                    open={true}
                    initial={editing}
                    suggestedNumber={suggestProductNumber(products.length)}
                    onClose={closeDialog}
                    onSave={handleSave}
                    saving={saving}
                    saveError={saveError}
                />
            )}
        </>
    )
}
