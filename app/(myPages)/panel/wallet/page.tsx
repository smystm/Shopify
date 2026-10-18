import type { Metadata } from "next"
import WalletClient from "@/app/components/panel/WalletClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.wallet.title,
   description: fa.panel.wallet.subtitle,
}

export default function PanelWalletPage() {
   return <WalletClient />
}