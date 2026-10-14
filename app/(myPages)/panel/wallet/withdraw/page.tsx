import type { Metadata } from "next"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import PanelComingSoon from "@/app/components/panel/PanelComingSoon"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.comingSoon.withdrawals

export const metadata: Metadata = {
   title: `${copy.title} — ${fa.header.brand}`,
   description: copy.subtitle,
}

export default function WithdrawalsPage() {
   return (
      <PanelComingSoon
         icon={<ArrowDownTrayIcon className="h-6 w-6" aria-hidden="true" />}
         title={copy.title}
         subtitle={copy.subtitle}
         body={copy.body}
      />
   )
}
