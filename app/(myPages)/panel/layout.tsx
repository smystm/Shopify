import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
      <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <header className="mb-8">
            <h1 className="text-3xl font-bold">My App</h1>
         </header>
         <main className="flex w-full max-w-md flex-col items-center text-2xl">{children}</main>
      </div>
   )
}
