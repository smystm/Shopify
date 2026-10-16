import type { Metadata } from "next"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import ProseSection from "@/app/components/info/ProseSection"
import VerifyWhy from "@/app/components/info/verify/VerifyWhy"
import VerifySteps from "@/app/components/info/verify/VerifySteps"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.verify

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

export default function VerifyPage() {
   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />
         <VerifyWhy />
         <VerifySteps />
         <ProseSection title={copy.privacyTitle} paragraphs={copy.privacyParagraphs} />
         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />
         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: "/login", tone: "primary" },
               { label: copy.ctaSecondary, href: "/products", tone: "ghost" },
            ]}
         />
      </>
   )
}
