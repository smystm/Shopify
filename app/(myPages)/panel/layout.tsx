import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SiteHeader from "@/app/components/layout/SiteHeader"

interface PanelLayoutProps {
   children: React.ReactNode
}

export default async function PanelLayout({ children }: PanelLayoutProps) {
   // Protected group: any page placed under app/panel/ inherits this rule.
   // Cookie-presence check only (no JWT/backend verification yet).
   const cookieStore = await cookies()
   if (!cookieStore.get("shopy-token")?.value) {
      redirect("/login")
   }

   return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
         <SiteHeader />
         <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
         </main>
      </div>
   )
}
