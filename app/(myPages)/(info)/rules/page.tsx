import type { Metadata } from "next"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import RulesSections from "@/app/components/info/rules/RulesSections"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.rules

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

export default function RulesPage() {
   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />
         <RulesSections />
         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />
         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: "/products", tone: "primary" },
               { label: copy.ctaSecondary, href: "/contact", tone: "ghost" },
            ]}
         />
      </>
   )
}
