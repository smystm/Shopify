import ProseSection from "@/app/components/info/ProseSection"
import { fa } from "@/app/lib/i18n/fa"

/**
 * What a Mann Co. key actually is - including the fact that it is not a CS2
 * item and does not open CS2 cases - and the account limits around holding them.
 */
export default function KeysGuide() {
   const copy = fa.info.tf2Keys

   return (
      <>
         <ProseSection title={copy.whatTitle} paragraphs={copy.whatParagraphs} />
         <ProseSection title={copy.limitsTitle} paragraphs={copy.limitsParagraphs} />
      </>
   )
}
