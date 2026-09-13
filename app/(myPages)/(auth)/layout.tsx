import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface AuthLayoutProps {
   children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
   // Guest-only group: any page placed under app/(auth)/ inherits this rule.
   // Cookie-presence check only (no JWT/backend verification yet).
   const cookieStore = await cookies()
   if (cookieStore.get("shopy-token")?.value) {
      redirect("/panel")
   }

   return (
      <main className="min-h-screen w-full flex flex-col">
         {/* you can add some common layout elements here, like a header or footer, if needed */}
         {children}
      </main>
   )
}
