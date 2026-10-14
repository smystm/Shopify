"use client"

import SiteHeader from "@/app/components/layout/SiteHeader"
import HomeClient from "@/app/components/home/HomeClient"

/**
 * No hydration gate here on purpose.
 *
 * The landing page used to be withheld until Redux reported `hydrated`, which
 * meant the server shipped nothing but a loading skeleton — bad for SEO and for
 * first paint. `HomeClient` now always renders the full landing page and only
 * swaps the auth-specific CTA once the user is known, so the page no longer
 * depends on auth to decide what to render.
 */
export default function Home() {
   return (
      <div dir="rtl" lang="fa" className="flex min-h-screen flex-col bg-navy-100 font-vazirmatn dark:bg-navy-950">
         <SiteHeader />
         <main className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
               <HomeClient />
            </div>
         </main>
      </div>
   )
}