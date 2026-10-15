export interface Category {
    id: number
    value: string
    subcategories?: string[]
    subcategory?: string
}

/**
 * Sort orders for the product list. `""` means "leave the backend default",
 * which is oldest-first. A closed union so an unknown `?sort=` cannot reach the
 * backend as an unchecked string.
 */
export type ProductSort = "" | "price_asc" | "price_desc" | "best_selling"

/**
 * The full marketplace filter state, and the single source of truth both filter
 * components slice from. `ProductCategoryFilter` emits only the category half
 * and `ProductPriceFilter` emits the search, sort and price half; each caller
 * merges its slice back over the current state before rebuilding the query
 * string.
 */
export interface ProductFilterState {
    selectedCategory: string
    selectedSubcategories: string[]
    minPrice: string
    maxPrice: string
    search: string
    sort: ProductSort
}

export interface AdminProduct {
    id: number
    productNumber: string
    price: string
    title: string
    desc: string
    category: Category
    created_at?: number | string | null
    image: string | null
    // User ID of the user who created this product.
    created_by?: number | null
}
