import type { Metadata } from "next"
import ProfileClient from "@/app/components/panel/ProfileClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.profileEdit.title,
   description: fa.panel.profileEdit.subtitle,
}

export default function PanelProfilePage() {
   return <ProfileClient />
}