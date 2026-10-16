import ProseSection from "@/app/components/info/ProseSection"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The two things a first-time Prime buyer needs explained: what Prime actually
 * is on a Steam account, and why the region changes the price.
 */
export default function PrimeGuide() {
   const copy = fa.info.prime

   return (
      <>
         <ProseSection title={copy.aboutTitle} paragraphs={copy.aboutParagraphs} />
         <ProseSection title={copy.regionTitle} paragraphs={copy.regionParagraphs} />
      </>
   )
}
