import type { Metadata } from "next"
import { unstable_rethrow } from "next/navigation"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import PageHero from "@/app/components/ui/PageHero"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import Reveal from "@/app/components/ui/Reveal"
import KeysCalculator from "@/app/components/info/tf2-keys/KeysCalculator"
import KeysFacts from "@/app/components/info/tf2-keys/KeysFacts"
import KeysHowTo from "@/app/components/info/tf2-keys/KeysHowTo"
import KeysGuide from "@/app/components/info/tf2-keys/KeysGuide"
import { getServicePrices } from "@/app/helpers/serviceApi"
import { supportTelegramWithText } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.tf2Keys

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * TF2 Mann Co. keys.
 *
 * Like /prime, the row is read from `service_prices` on every request, so this
 * route is dynamic. Only the calculator and the figures strip depend on that
 * call; the guide, FAQ and closing band are static copy and still render when it
 * fails.
 */
export default async function Tf2KeysPage() {
   let price: string | null = null
   let stock: number | null = null
   let maxQuantity: number | null = null
   let service = "tf2_keys"
   let variant = "key"

   try {
      const rows = await getServicePrices("tf2_keys")
      const key = rows.find((row) => row.variant === "key") ?? rows[0]

      if (key && Number.isFinite(Number(key.price))) {
         price = key.price
         stock = key.stock
         maxQuantity = key.max_quantity
         // Carried to the calculator so its add-to-cart names the same row the
         // price came from, rather than hard-coding the slug in the component.
         service = key.service
         variant = key.variant
      }
   } catch (error) {
      // Rethrown so Next keeps treating this route as dynamic - swallowing it
      // would let the build bake the page statically.
      unstable_rethrow(error)
   }

   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />

         {price !== null ? (
            <>
               <KeysCalculator service={service} variant={variant} price={price} stock={stock} maxQuantity={maxQuantity} />
               <KeysFacts price={price} stock={stock} maxQuantity={maxQuantity} />
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

         <KeysHowTo />
         <KeysGuide />

         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />

         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: copy.ctaPrimary, href: supportTelegramWithText(copy.orderIntro), tone: "primary", external: true },
               { label: copy.ctaSecondary, href: "/trade-link", tone: "ghost" },
            ]}
         />
      </>
   )
}
