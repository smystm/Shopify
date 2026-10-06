export interface Category {
    id: number
    value: string
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
