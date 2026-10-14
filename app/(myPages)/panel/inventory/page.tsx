import type { Metadata } from "next"
import { ArchiveBoxIcon } from "@heroicons/react/24/outline"
import PanelComingSoon from "@/app/components/panel/PanelComingSoon"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: `${fa.panel.inventory.title} — Shopify`,
   description: fa.panel.inventory.subtitle,
}

export default function PanelInventoryPage() {
   return (
      <PanelComingSoon
         icon={<ArchiveBoxIcon className="h-6 w-6" aria-hidden="true" />}
         title={fa.panel.inventory.title}
         subtitle={fa.panel.inventory.subtitle}
         body={fa.panel.inventory.emptyBody}
      />
   )
}