import type { Metadata } from "next"
import { unstable_rethrow } from "next/navigation"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import Reveal from "@/app/components/ui/Reveal"
import PrimeBuyCard from "@/app/components/info/prime/PrimeBuyCard"
import PrimeFacts from "@/app/components/info/prime/PrimeFacts"
import PrimeHowTo from "@/app/components/info/prime/PrimeHowTo"
import PrimeGuide from "@/app/components/info/prime/PrimeGuide"
import { getServicePrices } from "@/app/helpers/serviceApi"
import { supportTelegramWithText } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"
import type { ServicePrice } from "@/app/contracts/services"

const copy = fa.info.prime

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * CS2 Prime, priced per Steam region.
 *
 * `service_prices` is read on every request, so this route is dynamic - the same
 * reason the category landings are. The guide, FAQ and closing band are static
 * copy and still render when the catalogue call fails, so a dead backend costs
 * the prices but not the page.
 */
export default async function PrimePage() {
   let regions: ServicePrice[] = []

   try {
      regions = await getServicePrices("prime")
   } catch (error) {
      // Rethrown so Next keeps treating this route as dynamic - swallowing it
      // would let the build bake the page statically and the fetch would then
      // happen at compile time instead of request time.
      unstable_rethrow(error)
   }

   // A region without a usable amount cannot be priced or ordered, so it is left
   // out rather than rendered as an empty chip.
   const priced = regions.filter((region) => Number.isFinite(Number(region.price)))

   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />

         {priced.length > 0 ? (
            <>
               <PrimeBuyCard regions={priced} />
               <PrimeFacts regions={priced} />
            </>
         ) : (
            <section className="py-16">
               <Reveal>
                  <div className="rounded-3xl border border-border-strong bg-surface p-7 shadow-md shadow-navy-900/5 md:p-9">
                     <p className="flex items-start gap-3 text-sm leading-7 text-navy-600 dark:text-navy-300">
                        <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                        {copy.unavailable}
                     </p>

                     <a
                        href={supportTelegramWithText(copy.orderIntro)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                     >
                        {copy.orderCta}
                     </a>
                  </div>
               </Reveal>
            </section>
         )}

         <PrimeHowTo />
         <PrimeGuide />

         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />

         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: supportTelegramWithText(copy.orderIntro), tone: "primary", external: true },
               { label: copy.ctaSecondary, href: "/panel/wallet", tone: "ghost" },
            ]}
         />
      </>
   )
}
