import { GlobeAltIcon, TagIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import StatStrip, { type StatStripItem } from "@/app/components/ui/StatStrip"
import type { ServicePrice } from "@/app/contracts/services"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"

interface PrimeFactsProps {
   regions: readonly ServicePrice[]
}

/**
 * Live region figures, read straight from the priced regions.
 *
 * Deliberately takes the same rows the picker renders rather than recomputing
 * anything: the cheapest and priciest tiles have to agree with the chips above
 * them, including when a region is added or retired in the database.
 */
export default function PrimeFacts({ regions }: PrimeFactsProps) {
   const copy = fa.info.prime

   const amounts = regions.map((region) => Number(region.price)).filter((amount) => Number.isFinite(amount))
   if (amounts.length === 0) return null

   const items: StatStripItem[] = [
      { value: String(regions.length), label: copy.facts.regions, icon: <GlobeAltIcon className="h-5 w-5" aria-hidden="true" /> },
      { value: formatToman(Math.min(...amounts)), label: copy.facts.cheapest, icon: <TagIcon className="h-5 w-5" aria-hidden="true" /> },
      { value: formatToman(Math.max(...amounts)), label: copy.facts.priciest, icon: <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" /> },
   ]

   return (
      <section className="py-16">
         <StatStrip items={items} columns={3} />
      </section>
   )
}
