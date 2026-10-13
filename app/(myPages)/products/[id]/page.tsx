import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getSingleProduct } from "@/app/helpers/productApi"
import ProductDetail from "@/app/components/products/ProductDetail"
import { fa } from "@/app/lib/i18n/fa"

interface ProductPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params
    const product = await getSingleProduct(parseInt(id, 10))
    return {
        title: product ? `${product.title} — Shopify` : fa.products.detailMetaTitle,
        description: product?.desc ?? fa.products.detailMetaDescription,
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
