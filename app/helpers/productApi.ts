import type { AdminProduct, Category } from "@/app/contracts/products"
import { getLoginToken } from "./auth"

async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`, {
        headers: authHeaders(),
        credentials: "include",
        cache: "no-store",
    })
    if (!res.ok) {
        const detail = await res.text().catch(() => "")
        throw new Error(`GET /categories failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
    }
    const body: unknown = await res.json()
    if (typeof body === "object" && body !== null && Array.isArray((body as { categories?: unknown }).categories)) {
        return (body as { categories: Category[] }).categories
    }
    return []
}

interface ProductPayload {
    productNumber: string
    title: string
    desc: string
    category: Category
    price: string
    image: string
}

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

// Always send the raw JWT header expected by the backend when available.
function authHeaders(token?: string): Record<string, string> {
    const resolvedToken = token ?? getLoginToken()
    return resolvedToken ? { Authorization: resolvedToken } : {}
}

async function getProducts(token?: string): Promise<AdminProduct[]> {
    const headers = authHeaders(token)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_BASE}/products`, {
        headers,
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
        const detail = await res.text().catch(() => "")
        throw new Error(`GET /products failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
    }
    const body: unknown = await res.json()
    if (typeof body === "object" && body !== null && Array.isArray((body as { products?: unknown }).products)) {
        return (body as { products: AdminProduct[] }).products
    }
    return []
}

async function getSingleProduct(id: number, token?: string): Promise<AdminProduct | null> {
    const products = await getProducts(token)
    return products.find((p) => p.id === id) ?? null
}

async function createProduct(data: ProductPayload): Promise<AdminProduct> {
    const res = await fetch(`${API_BASE}/products`, {
       method: "POST",
       headers: { "Content-Type": "application/json", ...authHeaders() },
       credentials: "include",
       body: JSON.stringify(data),
    })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`POST /products failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
   const body: unknown = await res.json()
   if (typeof body === "object" && body !== null && "product" in body) {
      return (body as { product: AdminProduct }).product
   }
   throw new Error("Unexpected response from POST /products")
}

async function updateProduct(id: number, data: ProductPayload): Promise<AdminProduct> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
       method: "PUT",
       headers: { "Content-Type": "application/json", ...authHeaders() },
       credentials: "include",
       body: JSON.stringify(data),
    })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`PUT /products/${id} failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
   const body: unknown = await res.json()
   if (typeof body === "object" && body !== null && "product" in body) {
      return (body as { product: AdminProduct }).product
   }
   throw new Error("Unexpected response from PUT /products")
}

async function deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
       method: "DELETE",
       headers: authHeaders(),
       credentials: "include",
    })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`DELETE /products/${id} failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
}

export { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, getCategories }
