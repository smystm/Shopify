import { cookies } from "next/headers"
import ProductsClient from "@/app/components/admin/products/ProductsClient"
import AccessDenied from "@/app/components/admin/AccessDenied"
import { getProducts } from "@/app/helpers/productApi"
import { getCurrentUser } from "@/app/helpers/getCurrentUser"
import { canViewAdmin } from "@/app/lib/permissions"
import type { AuthUser } from "@/app/lib/store/authSlice"
import type { AdminProduct } from "@/app/contracts/products"

export default async function AdminProductsPage() {
   const token = (await cookies()).get("shopy-token")?.value

   let products: AdminProduct[] = []
   let loadError: string | null = null
   let currentUser: AuthUser | null = null
   try {
      // Check the user's permission before loading admin data.
      currentUser = await getCurrentUser(token ?? "")
      if (currentUser && canViewAdmin(currentUser.permission)) {
         products = await getProducts(token)
      }
   } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      loadError = `Could not load products from the API (${reason}). Make sure the phone-auth backend (back-authWithPhone) is running on :5000 with the protected GET /api/products endpoint, and that you are logged in with a fresh phone-verified token.`
   }

   if (loadError) {
      return (
         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Couldn&apos;t load products</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-red-600/90 dark:text-red-400/90">{loadError}</p>
         </div>
      )
   }

   if (!currentUser || !canViewAdmin(currentUser.permission)) {
      return <AccessDenied />
   }

   return <ProductsClient initialProducts={products} />
}
