import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import AuthForm from "@/app/components/auth/AuthForm"
import AuthShell from "@/app/components/ui/AuthShell"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.signupMetaTitle,
   description: fa.authPages.signupMetaDescription,
}

export default function RegisterPage() {
   return (
      <AuthShell>
         <Yokoso headKoso={fa.header.brand} paraKoso={fa.authPages.signupSubtitle} />
         <AuthForm mode="signup" />
      </AuthShell>
   )
}
