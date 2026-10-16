import FaqAccordion from "@/app/components/ui/FaqAccordion"
import { fa } from "@/app/lib/i18n/fa"

const ITEMS = ["authenticity", "payment", "delivery", "refund"] as const

/**
 * The `id` is the target for the footer's "سوالات متداول" link, and the
 * accordion's `scroll-mt-24` keeps the heading clear of the sticky header.
 */
export default function Faq() {
   return (
      <FaqAccordion
         id="faq"
         title={fa.home.faq.title}
         subtitle={fa.home.faq.subtitle}
         items={ITEMS.map((key) => fa.home.faq.items[key])}
      />
   )
}
