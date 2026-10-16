import type { Metadata } from "next"
import { notFound } from "next/navigation"
import OrderDetailClient from "@/app/components/panel/OrderDetailClient"
import { fa } from "@/app/lib/i18n/fa"

interface OrderDetailPageProps {
   /** Next 15 hands these over as promises, not plain objects. */
   params: Promise<{ id: string }>
   searchParams: Promise<{ placed?: string }>
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
   const { id } = await params

   return {
      title: `${fa.panel.orders.orderNumber} #${id} — ${fa.header.brand}`,
      description: fa.panel.orders.subtitle,
   }
}

/**
 * A single order from the customer's own history.
 *
 * The id is only parsed here - whether it exists, and whether it belongs to this
 * customer, is the backend's answer, not the URL's. `notFound()` is reserved for an
 * id that is not a number at all, which no link in the app can produce.
 */
export default async function PanelOrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
   const { id } = await params
   const { placed } = await searchParams
   const orderId = Number.parseInt(id, 10)

   if (!Number.isFinite(orderId) || orderId < 1) notFound()

   return <OrderDetailClient orderId={orderId} justPlaced={placed === "1"} />
}
