import type { Metadata } from "next"
import Yokoso from "@/app/components/auth/Yokoso"
import SteamSignIn from "@/app/components/auth/SteamSignIn"
import LoginClient from "./LoginClient"
import AuthShell from "@/app/components/ui/AuthShell"
import { getAuthMode } from "@/app/helpers/authApi"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.authPages.loginMetaTitle,
   description: fa.authPages.loginMetaDescription,
}

/**
 * Sign in.
 *
 * Both providers are rendered from the same two URLs on purpose. `/login` and
 * `/register` stay where they are and keep meaning what they always did - they
 * are two CTAs that both get you into the shop - and the page asks the backend
 * which one it is currently serving. While AUTH_PROVIDER=phone this is the form
 * it has always been; with it on steam this is a Steam button, and a first-time
 * visitor's account is created on the way back, so the two buttons are identical
 * by design rather than by accident.
 *
 * The choice is read per request rather than baked into the build, so switching
 * providers is a restart and not a redeploy of the storefront.
 */
export default async function LoginPage() {
   const mode = await getAuthMode()

   return (
      <AuthShell>
         <Yokoso headKoso={fa.header.brand} paraKoso={mode.provider === "steam" ? fa.authPages.steam.subtitle : fa.authPages.loginSubtitle} />
         {mode.provider === "steam" ? <SteamSignIn mode={mode} /> : <LoginClient />}
      </AuthShell>
   )
}