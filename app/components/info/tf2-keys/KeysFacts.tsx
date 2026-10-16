import { CubeIcon, KeyIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline"
import StatStrip, { type StatStripItem } from "@/app/components/ui/StatStrip"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"

interface KeysFactsProps {
   /** Toman per key, straight from `service_prices`. */
   price: string
   stock: number | null
   maxQuantity: number | null
}

/**
 * Stock, unit price and per-order cap, read from the same row the calculator
 * uses so the strip can never disagree with the stepper above it.
 *
 * Rendered only when all three figures exist: the shared strip lays out in
 * threes, and a two-tile row would read as a missing tile rather than a
 * deliberate one.
 */
export default function KeysFacts({ price, stock, maxQuantity }: KeysFactsProps) {
   const copy = fa.info.tf2Keys

   if (stock === null || maxQuantity === null) return null

   const items: StatStripItem[] = [
      { value: String(stock), label: copy.facts.stock, icon: <CubeIcon className="h-5 w-5" aria-hidden="true" /> },
      { value: formatToman(price), label: copy.facts.price, icon: <KeyIcon className="h-5 w-5" aria-hidden="true" /> },
      { value: String(maxQuantity), label: copy.facts.cap, icon: <ShieldExclamationIcon className="h-5 w-5" aria-hidden="true" /> },
   ]

   return (
      <section className="py-16">
         <StatStrip items={items} columns={3} />
      </section>
   )
}
