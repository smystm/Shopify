import type { Metadata } from "next"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import ProseSection from "@/app/components/info/ProseSection"
import AboutValues from "@/app/components/info/about/AboutValues"
import AboutStats from "@/app/components/info/about/AboutStats"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.about

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

export default function AboutPage() {
   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />
         <ProseSection title={copy.storyTitle} paragraphs={copy.storyParagraphs} />
         <AboutValues />
         <AboutStats />
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
