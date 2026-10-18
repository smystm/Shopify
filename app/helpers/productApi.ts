import type { AdminProduct, Category, ProductSort } from "@/app/contracts/products"
import { getLoginToken } from "./auth"
import { API_BASE } from "@/app/lib/apiBase"

// getCategories — fetch the list of all categories.
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

/**
 * The product fields POST/PUT accept.
 *
 * `specs` carries the optional CS2 specification columns - exterior, float
 * band, rarity and friends. Absent keys are left alone by the backend, so an
 * older caller that skips them keeps today's behaviour; `undefined` values
 * are dropped when the body is serialized, which reads as "not sent".
 */
export interface ProductSpecsPayload {
    exterior?: string | null
    float_min?: number | null
    float_max?: number | null
    stattrak?: number | null
    souvenir?: number | null
    rarity?: string | null
    collection?: string | null
    release_at?: number | null
    pattern_index?: number | null
    count?: number | null
}

interface ProductPayload extends ProductSpecsPayload {
   productNumber: string
   title: string
   desc: string
   category: Category
   price: string
   image: string
}

// Always send the raw JWT header expected by the backend when available.
function authHeaders(token?: string): Record<string, string> {
   const resolvedToken = token ?? getLoginToken()
   return resolvedToken ? { Authorization: resolvedToken } : {}
}

interface ProductFilters {
   categories?: string[]
   subcategories?: string[]
   minPrice?: string
   maxPrice?: string
   search?: string
   sort?: ProductSort
}

// getProducts — fetch all products, optionally filtered by category and price range.
async function getProducts(options?: { token?: string; filters?: ProductFilters }): Promise<AdminProduct[]> {
   const headers = authHeaders(options?.token)
   const params = new URLSearchParams()
   if (options?.filters?.categories) {
      options.filters.categories.forEach((c) => params.append("category", c))
   }
   if (options?.filters?.subcategories) {
      options.filters.subcategories.forEach((subcategory) => params.append("subcategory", subcategory))
   }
   if (options?.filters?.minPrice) params.set("minPrice", options.filters.minPrice)
   if (options?.filters?.maxPrice) params.set("maxPrice", options.filters.maxPrice)
   if (options?.filters?.search) params.set("search", options.filters.search)
   if (options?.filters?.sort) params.set("sort", options.filters.sort)
   const query = params.toString() ? `?${params.toString()}` : ""
   const controller = new AbortController()
   const timeout = setTimeout(() => controller.abort(), 5000)
   const res = await fetch(`${API_BASE}/products${query}`, {
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

// getSingleProduct — fetch one product by ID.
async function getSingleProduct(id: number, token?: string): Promise<AdminProduct | null> {
   const products = await getProducts({ token })
   return products.find((p) => p.id === id) ?? null
}

// createProduct — create a new product.
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

// updateProduct — update an existing product by ID.
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

// deleteProduct — delete a product by ID.
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
