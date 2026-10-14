import type { Metadata } from "next"
import OffersClient from "@/app/components/panel/OffersClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: `${fa.panel.offers.title} — Shopify`,
   description: fa.panel.offers.subtitle,
}

export default function PanelOffersPage() {
   return <OffersClient />
}