import type { Metadata } from "next"
import CartClient from "@/app/components/cart/CartClient"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: `${fa.cart.metaTitle} — ${fa.header.brand}`,
   description: fa.cart.metaDescription,
}

export default function CartPage() {
   return <CartClient />
}
