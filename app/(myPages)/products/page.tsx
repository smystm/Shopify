import { Suspense } from "react"
import ProductClient from "@/app/components/products/ProductClient"
import PageHero from "@/app/components/ui/PageHero"
import { fa } from "@/app/lib/i18n/fa"

export const metadata = {
   title: fa.products.metaTitle,
   description: fa.products.metaDescription,
}

function GridSkeleton() {
   return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
               <div className="aspect-square animate-pulse bg-navy-100/70 dark:bg-navy-900/50" />
               <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                  <div className="h-3 w-full animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                  <div className="flex items-center justify-between pt-1">
                     <div className="h-6 w-20 animate-pulse rounded bg-brand-500/20" />
                     <div className="h-9 w-24 animate-pulse rounded-full bg-navy-200 dark:bg-navy-800" />
                  </div>
               </div>
            </div>
         ))}
      </div>
   )
}

export default function ProductsPage() {
   return (
      <div>
         <PageHero
            title={fa.products.heading}
            description={fa.products.metaDescription}
            badge={fa.products.heroBadge}
            className="mb-8"
         />

         <Suspense fallback={<GridSkeleton />}>
            <ProductClient />
         </Suspense>
      </div>
   )
}