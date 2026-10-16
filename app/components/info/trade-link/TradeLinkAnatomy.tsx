import SectionHeading from "@/app/components/ui/SectionHeading"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

/** Swatch/text colour per URL segment: base address, partner id, trade token. */
const TONE = ["text-navy-400", "text-brand-300", "text-accent-300"] as const
const SWATCH = ["bg-navy-400", "bg-brand-300", "bg-accent-300"] as const

/**
 * The trade link, taken apart.
 *
 * The page is otherwise all prose and steps; this is the one place that shows
 * the address itself, so the three segments are colour-coded rather than left
 * as an undifferentiated string. Laid out LTR throughout - a URL is not Persian
 * text and reversing it would make it unreadable.
 */
export default function TradeLinkAnatomy() {
   const { anatomyTitle, anatomySubtitle, anatomy } = fa.info.tradeLink
   const [base, partner, token] = anatomy

   return (
      <section className="py-16">
         <SectionHeading title={anatomyTitle} subtitle={anatomySubtitle} />

         <Reveal delay={0.08} className="mx-auto mt-10 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-950 shadow-2xl shadow-navy-900/20">
               <div dir="ltr" className="overflow-x-auto px-6 py-6 font-mono text-xs whitespace-nowrap sm:text-sm">
                  <span className="text-navy-500 select-none">https://</span>
                  <span className={TONE[0]}>{base.value}</span>
                  <span className="text-navy-500 select-none">?</span>
                  <span className={TONE[1]}>{partner.value}</span>
                  <span className="text-navy-500 select-none">&amp;</span>
                  <span className={TONE[2]}>{token.value}</span>
               </div>

               <dl dir="ltr" className="grid gap-px border-t border-navy-800 bg-navy-800 sm:grid-cols-3">
                  {anatomy.map((part, i) => (
                     <div key={part.label} className="bg-navy-900 px-5 py-5">
                        <dt className="flex items-center gap-2 text-xs font-bold text-white">
                           <span className={`h-2 w-2 shrink-0 rounded-full ${SWATCH[i]}`} aria-hidden="true" />
                           {part.label}
                        </dt>
                        <dd className="mt-2 font-mono text-[11px] break-all text-navy-400">{part.value}</dd>
                        <dd className="mt-3 text-xs leading-6 text-navy-300" dir="rtl">
                           {part.note}
                        </dd>
                     </div>
                  ))}
               </dl>
            </div>
         </Reveal>
      </section>
   )
}
