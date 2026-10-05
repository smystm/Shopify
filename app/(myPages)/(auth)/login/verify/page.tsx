import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import VerifyForm from "@/app/components/auth/VerifyForm"

export const metadata: Metadata = {
   title: "Verify phone — Shopify",
   description: "Enter the verification code sent to your phone.",
}

export default function VerifyPage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <Yokoso headKoso="Shopify" paraKoso="Enter the verification code sent to your phone." />
         <VerifyForm />
      </div>
   )
}
