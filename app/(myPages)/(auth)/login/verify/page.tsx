import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import VerifyForm from "@/app/components/auth/VerifyForm"
import AuthShell from "@/app/components/ui/AuthShell"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.verifyMetaTitle,
   description: fa.authPages.verifyMetaDescription,
}

export default function VerifyPage() {
   return (
      <AuthShell>
         <Yokoso headKoso={fa.header.brand} paraKoso={fa.authPages.verifySentHint} />
         <VerifyForm />
      </AuthShell>
   )
}
