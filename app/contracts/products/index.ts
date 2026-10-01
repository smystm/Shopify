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
}
