import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import SteamSignIn from "@/app/components/auth/SteamSignIn"
import AuthForm from "@/app/components/auth/AuthForm"
import AuthShell from "@/app/components/ui/AuthShell"
import { getAuthMode } from "@/app/helpers/authApi"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.signupMetaTitle,
   description: fa.authPages.signupMetaDescription,
}

/**
 * Register.
 *
 * Kept as its own page and its own button, as asked - but with Steam there is
 * nothing to register. The first sign-in creates the account, so this page is the
 * same Steam button as /login and the difference is only the words around it.
 * That is a real behaviour change and not a broken link, which is why the copy
 * below says what is about to happen rather than showing a signup form nobody
 * fills in.
 */
export default async function RegisterPage() {
   const mode = await getAuthMode()

   return (
      <AuthShell>
         <Yokoso
            headKoso={fa.header.brand}
            paraKoso={mode.provider === "steam" ? fa.authPages.steam.signupSubtitle : fa.authPages.signupSubtitle}
         />
         {mode.provider === "steam" ? <SteamSignIn mode={mode} /> : <AuthForm mode="signup" />}
      </AuthShell>
   )
}