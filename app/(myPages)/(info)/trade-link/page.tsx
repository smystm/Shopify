import type { Metadata } from "next"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import ProseSection from "@/app/components/info/ProseSection"
import TradeLinkSteps from "@/app/components/info/trade-link/TradeLinkSteps"
import TradeLinkAnatomy from "@/app/components/info/trade-link/TradeLinkAnatomy"
import TradeLinkMistakes from "@/app/components/info/trade-link/TradeLinkMistakes"
import TradeLinkPanelCta from "@/app/components/info/trade-link/TradeLinkPanelCta"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.tradeLink

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * Documentation only - the field itself already works.
 *
 * /panel/profile validates and stores the link, so this page explains what a
 * trade link is and then sends people to the field, rather than duplicating a
 * form that would need its own validation rules.
 */
export default function TradeLinkPage() {
   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />
         <ProseSection title={copy.introTitle} paragraphs={copy.introParagraphs} />
         <TradeLinkSteps />
         <TradeLinkAnatomy />
         <TradeLinkMistakes />
         <TradeLinkPanelCta />
         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />
         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: "/panel/profile", tone: "primary" },
               { label: copy.ctaSecondary, href: "/products", tone: "ghost" },
            ]}
         />
      </>
   )
}
