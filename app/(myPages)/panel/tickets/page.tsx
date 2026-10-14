import type { Metadata } from "next"
import { LifebuoyIcon } from "@heroicons/react/24/outline"
import PanelComingSoon from "@/app/components/panel/PanelComingSoon"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: `${fa.panel.tickets.title} — Shopify`,
   description: fa.panel.tickets.subtitle,
}

export default function PanelTicketsPage() {
   return (
      <PanelComingSoon
         icon={<LifebuoyIcon className="h-6 w-6" aria-hidden="true" />}
         title={fa.panel.tickets.title}
         subtitle={fa.panel.tickets.subtitle}
         body={fa.panel.tickets.emptyBody}
      />
   )
}