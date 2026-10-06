import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getSingleProduct } from "@/app/helpers/productApi"
import ProductDetail from "@/app/components/products/ProductDetail"

interface ProductPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params
    const product = await getSingleProduct(parseInt(id, 10))
    return {
        title: product ? `${product.title} — Shopify` : "Product — Shopify",
        description: product?.desc ?? "Product details",
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("shopy-token")?.value

    let product
    try {
        product = await getSingleProduct(parseInt(id, 10), token)
    } catch (err) {
        console.error("Failed to fetch product:", err)
        notFound()
    }

    if (!product) {
        notFound()
    }

    return <ProductDetail product={product} />
}
