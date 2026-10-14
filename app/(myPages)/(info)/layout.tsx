import type { ReactNode } from "react"
import SiteHeader from "@/app/components/layout/SiteHeader"
import SiteFooter from "@/app/components/layout/SiteFooter"

interface InfoLayoutProps {
   children: ReactNode
}

/**
 * Shell for the public routes the footer links to that are not built yet
 * (contact, about, rules, …). Same chrome as /products, so they look like
 * part of the site rather than orphaned pages.
 */
export default function InfoLayout({ children }: InfoLayoutProps) {
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
