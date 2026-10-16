import type { Metadata } from "next"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import ContactChannels from "@/app/components/info/contact/ContactChannels"
import ContactBefore from "@/app/components/info/contact/ContactBefore"
import ContactHours from "@/app/components/info/contact/ContactHours"
import { SUPPORT_TELEGRAM_URL } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.contact

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * A hub for the channels that actually exist - no contact form.
 *
 * There is no message endpoint on the backend, and a form that looks like it
 * sends something but quietly does nothing is worse than having none, so the
 * page does the honest thing and points at real destinations instead.
 */
export default function ContactPage() {
   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />
         <ContactChannels />
         <ContactBefore />
         <ContactHours />
         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />
         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: SUPPORT_TELEGRAM_URL, tone: "primary", external: true },
               { label: copy.ctaSecondary, href: "/products", tone: "ghost" },
            ]}
         />
      </>
   )
}
