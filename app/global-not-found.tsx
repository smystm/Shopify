"use client"

import type { Metadata } from "next"
import "./globals.css"
import Button from "@/app/components/ui/Button"

export const metadata: Metadata = {
   title: "404 - Page Not Found",
   description: "The page you are looking for does not exist.",
}

export default function GlobalNotFound() {
   return (
      <html lang="en">
         <body className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
               <p className="mb-4 text-7xl font-medium tracking-widest text-zinc-400 uppercase dark:text-zinc-500">404</p>
               <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Page not found</h1>
               <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">The page you are looking for doesn&apos;t exist or has been moved.</p>
               <div className="flex gap-3">
                  <Button
                     onClick={() => (window.location.href = "/")}
                     className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                     Go Back
                  </Button>
               </div>
            </div>
         </body>
      </html>
   )
}
