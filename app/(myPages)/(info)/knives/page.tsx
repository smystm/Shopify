import type { Metadata } from "next"
import { ScissorsIcon } from "@heroicons/react/24/outline"
import ComingSoon from "@/app/components/ui/ComingSoon"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.comingSoon.knives

export const metadata: Metadata = {
   title: `${copy.title} — ${fa.header.brand}`,
   description: copy.subtitle,
}

export default function KnivesPage() {
   return <ComingSoon icon={<ScissorsIcon className="h-6 w-6" aria-hidden="true" />} title={copy.title} subtitle={copy.subtitle} body={copy.body} />
}
