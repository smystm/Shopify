"use client"

import { useAppSelector } from "@/app/lib/store/hooks"
import SiteHeader from "@/app/components/layout/SiteHeader"
import HomeClient from "@/app/components/home/HomeClient"
import Loading from "./loading"

export default function Home() {
   const hydrated = useAppSelector((s) => s.auth.hydrated)

   if (!hydrated) {
      return <Loading />
   }

   return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
         <SiteHeader />
         <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <HomeClient />
         </main>
      </div>
   )
}
