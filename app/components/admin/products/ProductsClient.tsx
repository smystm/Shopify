"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/outline"
import ProductCreateDialog from "./ProductCreateDialog"
import ProductEditDialog from "./ProductEditDialog"
import ProductDeleteDialog from "./ProductDeleteDialog"
import AdminPagination from "@/app/components/admin/AdminPagination"
import ProductsTable from "./ProductsTable"
import ProductsEmptyState from "./ProductsEmptyState"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminProduct, Category } from "@/app/contracts/products"
import { PRODUCTS_PAGE_SIZE, suggestProductNumber } from "@/app/lib/products"
import { canCreateProduct, canModifyProduct } from "@/app/lib/permissions"
import { useAppSelector } from "@/app/lib/store/hooks"
import { selectAuthUser, selectPermission } from "@/app/lib/store/authSlice"
import { getProducts, getCategories } from "@/app/helpers/productApi"
import ProductFilter from "@/app/components/ui/ProductFilter"

interface ProductsClientProps {
    initialProducts: AdminProduct[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    // Read the signed-in user's permission from Redux.
    const user = useAppSelector(selectAuthUser)
    const permission = useAppSelector(selectPermission)
    const [products, setProducts] = useState<AdminProduct[]>(initialProducts)
    const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null)

    const pageParam = searchParams.get("page")
    const rawPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

    const selectedCategoryParam = searchParams.get("category") ?? ""
    const minPriceParam = searchParams.get("minPrice") ?? ""
    const maxPriceParam = searchParams.get("maxPrice") ?? ""

    const createModal = searchParams.get("create") === "true"
    const editId = searchParams.get("edit")
    const editing = editId ? products.find((p) => p.id === Number(editId)) ?? null : null

    const hasFilters = selectedCategoryParam !== "" || minPriceParam !== "" || maxPriceParam !== ""
    const [filteredProducts, setFilteredProducts] = useState<AdminProduct[] | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [filterLoading, setFilterLoading] = useState(false)

    useEffect(() => {
        getCategories().then(setCategories).catch(() => setCategories([]))
    }, [])

    useEffect(() => {
        if (!hasFilters) {
            setFilteredProducts(null)
            return
        }
        let cancelled = false
        setFilterLoading(true)
        getProducts({ filters: { categories: selectedCategoryParam ? [selectedCategoryParam] : [], minPrice: minPriceParam, maxPrice: maxPriceParam } })
            .then((data) => {
                if (!cancelled) setFilteredProducts(data)
            })
            .catch(() => {
                if (!cancelled) setFilteredProducts([])
            })
            .finally(() => {
                if (!cancelled) setFilterLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [searchParams.toString()])

    const displayProducts = filteredProducts ?? products

    const totalPages = Math.max(1, Math.ceil(displayProducts.length / PRODUCTS_PAGE_SIZE))
    const isOutOfRange = rawPage > totalPages
    const safePage = Math.min(rawPage, totalPages)

    const visibleProducts = useMemo(
        () => displayProducts.slice((safePage - 1) * PRODUCTS_PAGE_SIZE, safePage * PRODUCTS_PAGE_SIZE),
        [displayProducts, safePage],
    )

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleFilterChange = (next: { selectedCategory: string; minPrice: string; maxPrice: string }) => {
        const params = new URLSearchParams()
        if (next.selectedCategory) params.set("category", next.selectedCategory)
        if (next.minPrice) params.set("minPrice", next.minPrice)
        if (next.maxPrice) params.set("maxPrice", next.maxPrice)
        params.set("page", "1")
        router.push(`?${params.toString()}`, { scroll: false })
    }

    // UI permissions mirror the backend checks.
    const canCreate = canCreateProduct(permission)
    const canEditProduct = (product: AdminProduct) => canModifyProduct(permission, user?.id, product)
    const canDeleteProduct = (product: AdminProduct) => canModifyProduct(permission, user?.id, product)

    const closeDialog = () => {
        router.push("/admin/products", { scroll: false })
    }

    const handleCreated = (product: AdminProduct) => {
        setProducts((prev) => [product, ...prev])
        setFilteredProducts((prev) => (prev ? [product, ...prev] : prev))
        handlePageChange(1)
    }

    const handleUpdated = (product: AdminProduct) => {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
        setFilteredProducts((prev) => (prev ? prev.map((p) => (p.id === product.id ? product : p)) : prev))
    }

    const handleDeleted = (id: number) => {
        const remaining = products.filter((p) => p.id !== id)
        setProducts(remaining)
        setFilteredProducts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev))
        const newTotalPages = Math.max(1, Math.ceil(remaining.length / PRODUCTS_PAGE_SIZE))
        handlePageChange(Math.min(rawPage, newTotalPages))
    }

    return (
        <>
            {permission === "NoAccess" ? (
                <AccessDenied />
            ) : (
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
                                {displayProducts.length} total
                            </span>
                            {/* Only users allowed to add products see the create button. */}
                            {canCreate && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/products?create=true", { scroll: false })}
                                    className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                >
                                    <PlusIcon aria-hidden="true" className="h-5 w-5" />
                                    Add Product
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="mb-4">
                            <ProductFilter
                                categories={categories}
                                selectedCategory={selectedCategoryParam}
                                minPrice={minPriceParam}
                                maxPrice={maxPriceParam}
                                onChange={handleFilterChange}
                            />
                        </div>
                        {filterLoading ? (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading filtered products…</p>
                        ) : isOutOfRange ? (
                            <ProductsEmptyState variant="page-out-of-range" onGoToFirstPage={() => handlePageChange(1)} />
                        ) : visibleProducts.length === 0 ? (
                            <ProductsEmptyState variant="no-products" />
                        ) : (
                            <ProductsTable
                                products={visibleProducts}
                                onEdit={(p) => router.push(`/admin/products?edit=${p.id}`, { scroll: false })}
                                onDelete={(id) => {
                                    const target = products.find((p) => p.id === id)
                                    if (target) setPendingDelete(target)
                                }}
                                canEdit={canEditProduct}
                                canDelete={canDeleteProduct}
                            />
                        )}
                    </div>

                    <AdminPagination
                        page={rawPage}
                        totalPages={totalPages}
                        total={displayProducts.length}
                        pageSize={PRODUCTS_PAGE_SIZE}
                        onPageChange={handlePageChange}
                    />

                    {/* Dialogs are mounted only when the current user has rights to use them. */}
                    {canCreate && (
                        <ProductCreateDialog
                            open={createModal}
                            suggestedNumber={suggestProductNumber(products.length)}
                            onClose={closeDialog}
                            onCreated={handleCreated}
                        />
                    )}

                    {editing && canEditProduct(editing) && (
                        <ProductEditDialog
                            product={editing}
                            onClose={closeDialog}
                            onUpdated={handleUpdated}
                        />
                    )}

                    {pendingDelete && canDeleteProduct(pendingDelete) && (
                        <ProductDeleteDialog
                            product={pendingDelete}
                            onClose={() => setPendingDelete(null)}
                            onDeleted={handleDeleted}
                        />
                    )}
                </>
            )}
        </>
    )
}
