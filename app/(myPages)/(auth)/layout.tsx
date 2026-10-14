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
      /* Background, orbs and centering live in <AuthShell>; the cookie guard above
         applies to every page in this group. */
      <main dir="rtl" lang="fa" className="font-vazirmatn">
         {children}
      </main>
   )
}
