import { redirect } from "next/navigation"

/**
 * The header links here for "سفارش‌ها", but orders live in the panel next to the
 * rest of the account - wallet, inventory, trade offers - so this route only
 * forwards. It exists because the link predates the panel page and a 404 is a
 * worse answer than a redirect.
 */
export default function OrdersRedirectPage() {
   redirect("/panel/orders")
}
