import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import AuthForm from "@/app/components/auth/AuthForm"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.signupMetaTitle,
   description: fa.authPages.signupMetaDescription,
}

export default function RegisterPage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-vazirmatn dark:bg-black">
         <Yokoso headKoso={fa.header.brand} paraKoso={fa.authPages.signupSubtitle} />
         <AuthForm mode="signup" />
      </div>
   )
}
