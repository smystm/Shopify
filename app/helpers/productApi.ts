import type { AdminProduct } from "@/app/contracts/products"

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

async function getProducts(token?: string): Promise<AdminProduct[]> {
   const headers: Record<string, string> = {}
   if (token) {
      headers["Authorization"] = token
   }
   const res = await fetch(`${API_BASE}/products`, {
      headers,
      credentials: "include",
      cache: "no-store",
   })
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

async function createProduct(data: { productNumber: string; title: string }): Promise<AdminProduct> {
   const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

async function updateProduct(id: number, data: { productNumber: string; title: string }): Promise<AdminProduct> {
   const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      credentials: "include",
   })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`DELETE /products/${id} failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
}

export { getProducts, createProduct, updateProduct, deleteProduct }
