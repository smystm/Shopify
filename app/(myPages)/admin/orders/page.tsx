import type { Metadata } from "next"
import { cookies } from "next/headers"
import OrdersClient from "@/app/components/admin/orders/OrdersClient"
import AccessDenied from "@/app/components/admin/AccessDenied"
import type { AdminOrder, OrdersSummary } from "@/app/contracts/panel"
import { getCurrentUser } from "@/app/helpers/getCurrentUser"
import { canViewAdmin } from "@/app/lib/permissions"
import type { AuthUser } from "@/app/lib/store/authSlice"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.admin.orders.metaTitle,
   description: fa.admin.orders.metaDescription,
}

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

async function getOrders(token: string): Promise<{ orders: AdminOrder[]; summary: OrdersSummary }> {
   if (!token) throw new Error("missing shopy-token cookie (not logged in)")
   const res = await fetch(`${API_BASE}/orders/all`, {
      headers: { Authorization: token },
      cache: "no-store",
   })
   if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(`GET /orders/all failed with ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`)
   }
   const body: unknown = await res.json()
   const parsed = (body ?? {}) as { orders?: unknown; summary?: unknown }
   const orders = Array.isArray(parsed.orders) ? (parsed.orders as AdminOrder[]) : []
   const summary = parsed.summary as OrdersSummary | undefined
   return {
      orders,
      summary: summary ?? { total: orders.length, byStatus: {} },
   }
}

export default async function AdminOrdersPage() {
   const token = (await cookies()).get("shopy-token")?.value ?? ""

   let orders: AdminOrder[] = []
   let summary: OrdersSummary = { total: 0, byStatus: {} }
   let loadError: string | null = null
   let currentUser: AuthUser | null = null
   try {
      // Check the user's permission before loading the order book.
      currentUser = await getCurrentUser(token)
      if (currentUser && canViewAdmin(currentUser.permission)) {
         const result = await getOrders(token)
         orders = result.orders
         summary = result.summary
      }
   } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      loadError = `Could not load orders from the API (${reason}). Make sure the API backend (shopify-back) is running on :5000 with the protected GET /api/orders/all endpoint, and that you are logged in with a fresh phone-verified token.`
   }

   if (loadError) {
      return (
         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">{fa.admin.ordersLoadError.title}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-red-600/90 dark:text-red-400/90">{loadError}</p>
         </div>
      )
   }

   if (!currentUser || !canViewAdmin(currentUser.permission)) {
      return <AccessDenied />
   }

   return <OrdersClient initialOrders={orders} initialSummary={summary} />
}
