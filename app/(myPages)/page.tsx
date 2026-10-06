"use client"

import Link from "next/link"
import { useAppSelector } from "@/app/lib/store/hooks"
import YokosoUser from "@/app/components/panel/YokosoUser"
import SiteHeader from "@/app/components/layout/SiteHeader"
import Loading from "./loading"

export default function Home() {
   const user = useAppSelector((s) => s.auth.user)
   const hydrated = useAppSelector((s) => s.auth.hydrated)

   if (!hydrated) {
      return <Loading />
   }

   return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
         <SiteHeader />
         <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            {user ? (
               <YokosoUser />
            ) : (
               <>
                  <h3 className="mb-1 text-3xl font-medium tracking-tight font-vazirmatn">شاپیفای - دمو🛍️</h3>
                  <p className="mb-8 text-sm text-zinc-500">Your e-commerce starter</p>
                  <div className="flex gap-3">
                     <Link
                        href="/login"
                        className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                     >
                        Log in
                     </Link>
                     <Link href="/register" className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                        Sign up
                     </Link>
                  </div>
               </>
            )}
         </main>
      </div>
   )
}
