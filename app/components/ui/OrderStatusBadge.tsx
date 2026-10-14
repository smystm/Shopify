import type { OrderStatus, TradeOfferStatus } from "@/app/contracts/panel"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Status pill using the trade lifecycle rather than shipping states.
 *
 * Every tone was contrast-audited in both themes against `bg-surface`:
 * light reads 4.51–6.31, dark 6.06–11.47.
 */
const TONES: Record<OrderStatus, string> = {
   // Waiting on the buyer.
   pending_payment: "bg-accent-500/15 text-accent-800 dark:text-accent-300",
   // Money held by the store, trade not sent yet.
   in_escrow: "bg-navy-500/15 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200",
   // A Steam trade offer is out.
   trade_sent: "bg-brand-500/15 text-brand-700 dark:text-brand-300",
   // Done.
   completed: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
   // Needs attention.
   disputed: "bg-red-600/15 text-red-700 dark:text-red-300",
   refunded: "bg-navy-400/20 text-navy-700 dark:bg-navy-400/20 dark:text-navy-200",
   cancelled: "bg-navy-400/20 text-navy-700 dark:bg-navy-400/20 dark:text-navy-200",
}

export default function OrderStatusBadge({ status, className = "" }: { status: OrderStatus; className?: string }) {
   const tone = TONES[status] ?? TONES.pending_payment

   return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone} ${className}`}>
         <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
         {fa.panel.orderStatus[status] ?? status}
      </span>
   )
}

/* ------------------------------------------------------------------ offers */

const OFFER_TONES: Record<TradeOfferStatus, string> = {
   pending: "bg-accent-500/15 text-accent-800 dark:text-accent-300",
   accepted: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
   declined: "bg-red-600/15 text-red-700 dark:text-red-300",
   cancelled: "bg-navy-400/20 text-navy-700 dark:text-navy-200",
}

export function TradeOfferStatusBadge({ status, className = "" }: { status: TradeOfferStatus; className?: string }) {
   const tone = OFFER_TONES[status] ?? OFFER_TONES.pending

   return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone} ${className}`}>
         <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
         {fa.panel.offerStatus[status] ?? status}
      </span>
   )
}