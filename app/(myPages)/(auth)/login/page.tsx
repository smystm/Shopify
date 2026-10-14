import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import AuthShell from "@/app/components/ui/AuthShell"
import LoginClient from "./LoginClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.loginMetaTitle,
   description: fa.authPages.loginMetaDescription,
}

export default function LoginPage() {
   return (
      <AuthShell>
         <Yokoso headKoso={fa.header.brand} paraKoso={fa.authPages.loginSubtitle} />
         <LoginClient />
      </AuthShell>
   )
}
