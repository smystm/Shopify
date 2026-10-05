import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import LoginClient from "./LoginClient"

export const metadata: Metadata = {
   title: "Log in — Shopify",
   description: "Log in to continue shopping.",
}

export default function LoginPage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <Yokoso headKoso="Shopify" paraKoso="Log in to continue shopping." />
         <LoginClient />
      </div>
   )
}
