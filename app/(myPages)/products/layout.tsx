import SiteHeader from "@/app/components/layout/SiteHeader"

interface ProductsLayoutProps {
   children: React.ReactNode
}

export default function ProductsLayout({ children }: ProductsLayoutProps) {
   return (
      <div dir="rtl" lang="fa" className="flex min-h-screen flex-col bg-navy-100 font-vazirmatn dark:bg-navy-950">
         <SiteHeader />
         <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
         </main>
      </div>
   )
}
