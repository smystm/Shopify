"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/outline"
import ProductCreateDialog from "./ProductCreateDialog"
import ProductEditDialog from "./ProductEditDialog"
import ProductDeleteDialog from "./ProductDeleteDialog"
import Pagination from "@/app/components/ui/Pagination"
import ProductsTable from "./ProductsTable"
import ProductsEmptyState from "./ProductsEmptyState"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminProduct, Category, ProductFilterState, ProductSort } from "@/app/contracts/products"
import { PRODUCTS_PAGE_SIZE, suggestProductNumber } from "@/app/lib/products"
import { canCreateProduct, canModifyProduct } from "@/app/lib/permissions"
import { useAppSelector } from "@/app/lib/store/hooks"
import { selectAuthUser, selectPermission } from "@/app/lib/store/authSlice"
import { getProducts, getCategories } from "@/app/helpers/productApi"
import ProductCategoryFilter, { type CategorySelection } from "@/app/components/products/ProductCategoryFilter"
import ProductPriceFilter, { type PanelFilterChange } from "@/app/components/products/ProductPriceFilter"
import { fa } from "@/app/lib/i18n/fa"

const PRODUCT_SORTS: ProductSort[] = ["", "price_asc", "price_desc", "best_selling"]

/** The URL is user-editable, so a hand-typed ?sort= must not become state. */
function toProductSort(value: string | null): ProductSort {
    return PRODUCT_SORTS.includes(value as ProductSort) ? (value as ProductSort) : ""
}

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
    const selectedSubcategoriesParam = selectedCategoryParam ? searchParams.getAll("subcategory") : []
    const minPriceParam = searchParams.get("minPrice") ?? ""
    const maxPriceParam = searchParams.get("maxPrice") ?? ""
    const searchParam = searchParams.get("search") ?? ""
    const sortParam = toProductSort(searchParams.get("sort"))

    const createModal = searchParams.get("create") === "true"
    const editId = searchParams.get("edit")
    const editing = editId ? products.find((p) => p.id === Number(editId)) ?? null : null

    // Search and sort must be in here too: this flag decides whether the list
    // comes from the filtered fetch or falls back to the unfiltered `products`,
    // so omitting them would make admin silently ignore both.
    const hasFilters = selectedCategoryParam !== "" || selectedSubcategoriesParam.length > 0 || minPriceParam !== "" || maxPriceParam !== "" || searchParam !== "" || sortParam !== ""
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
        getProducts({
            filters: {
                categories: selectedCategoryParam ? [selectedCategoryParam] : [],
                subcategories: selectedSubcategoriesParam,
                minPrice: minPriceParam,
                maxPrice: maxPriceParam,
                search: searchParam,
                sort: sortParam,
            },
        })
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

    const handleFilterChange = (next: ProductFilterState) => {
        const params = new URLSearchParams()
        if (next.selectedCategory) params.set("category", next.selectedCategory)
        next.selectedSubcategories.forEach((subcategory) => params.append("subcategory", subcategory))
        if (next.minPrice) params.set("minPrice", next.minPrice)
        if (next.maxPrice) params.set("maxPrice", next.maxPrice)
        if (next.search) params.set("search", next.search)
        if (next.sort) params.set("sort", next.sort)
        params.set("page", "1")
        // Filters refine the current view rather than navigating, so they
        // replace instead of pushing one history entry per keystroke.
        router.replace(`?${params.toString()}`, { scroll: false })
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
                            <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.admin.products.title}</h1>
                            <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
                                {fa.admin.products.subtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-brand-500/25 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300">
                                {fa.admin.products.total.replace("{count}", String(displayProducts.length))}
                            </span>
                            {/* Only users allowed to add products see the create button. */}
                            {canCreate && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/products?create=true", { scroll: false })}
                                    className="group relative inline-flex items-center gap-x-1.5 overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                                >
                                    <PlusIcon aria-hidden="true" className="h-5 w-5" />
                                    {fa.admin.products.addProduct}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="mb-4">
                            <ProductCategoryFilter
                                categories={categories}
                                selectedCategory={selectedCategoryParam}
                                selectedSubcategories={selectedSubcategoriesParam}
                                labels={fa.products.filter}
                                onChange={handleCategoryChange}
                            />
                            <div className="mt-4">
                                <ProductPriceFilter
                                    minPrice={minPriceParam}
                                    maxPrice={maxPriceParam}
                                    search={searchParam}
                                    sort={sortParam}
                                    labels={fa.products.filter}
                                    onChange={handlePanelChange}
                                    onClearAll={clearAllFilters}
                                />
                            </div>
                        </div>
                        {filterLoading ? (
                            <p className="text-sm text-navy-500 dark:text-navy-400">{fa.admin.products.loadingFiltered}</p>
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

                    <Pagination
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
