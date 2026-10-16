import type { ReactNode } from "react"
import SiteHeader from "@/app/components/layout/SiteHeader"
import SiteFooter from "@/app/components/layout/SiteFooter"

interface CartLayoutProps {
   children: ReactNode
}

/**
 * Shell for /cart.
 *
 * The same chrome as /products and the info pages, rendered here rather than in a
 * shared group layout because `(myPages)` has none - each route brings its own.
 */
export default function CartLayout({ children }: CartLayoutProps) {
   return (
      <div dir="rtl" lang="fa" className="flex min-h-screen flex-col bg-navy-100 font-vazirmatn dark:bg-navy-950">
         <SiteHeader />
         <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
         </main>
         <SiteFooter />
      </div>
   )
}
