import { Suspense } from "react"
import ProductClient from "@/app/components/products/ProductClient"

export const metadata = {
   title: "Products",
   description: "Browse our product catalog.",
}

export default function ProductsPage() {
   return (
      <div>
         <h1 className="mb-6 text-2xl font-bold">Products</h1>
         <Suspense
            fallback={
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                     <div
                        key={i}
                        className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                     />
                  ))}
               </div>
            }
         >
            <ProductClient />
         </Suspense>
      </div>
   )
}
