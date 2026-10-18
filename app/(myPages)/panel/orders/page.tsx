import type { Metadata } from "next"
import OrdersClient from "@/app/components/panel/OrdersClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.orders.title,
   description: fa.panel.orders.subtitle,
}

export default function PanelOrdersPage() {
   return <OrdersClient />
}