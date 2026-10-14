import type { Metadata } from "next"
import { cookies } from "next/headers"
import PanelDashboard from "@/app/components/panel/PanelDashboard"
import type { AuthUser } from "@/app/lib/store/authSlice"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.metaTitle,
   description: fa.panel.metaDescription,
}

export default async function PanelPage() {
   // Read the user server-side rather than from Redux: AuthHydrator only
   // dispatches in an effect, so a client read would flash an empty panel on
   // every hard load. The layout already guarantees the token cookie exists.
   const cookieStore = await cookies()
   const raw = cookieStore.get("shopy-user")?.value

   let user: AuthUser | null = null
   if (raw) {
      try {
         user = JSON.parse(raw) as AuthUser
      } catch {
         // A corrupt cookie should not take the whole page down.
         user = null
      }
   }

   return <PanelDashboard user={user} />
}