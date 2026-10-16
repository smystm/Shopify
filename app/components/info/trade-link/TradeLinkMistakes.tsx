import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import SectionHeading from "@/app/components/ui/SectionHeading"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The four ways a trade link goes wrong.
 *
 * Tinted with the palette's accent (saffron) rather than a red error colour:
 * these are the ordinary mistakes that delay a delivery, not failures, and the
 * page should not read as an alarm.
 */
export default function TradeLinkMistakes() {
   const { mistakesTitle, mistakesSubtitle, mistakes } = fa.info.tradeLink

   return (
      <section className="py-16">
         <SectionHeading title={mistakesTitle} subtitle={mistakesSubtitle} />

         <Reveal delay={0.08} className="mx-auto mt-10 max-w-3xl">
            <ul className="divide-y divide-accent-400/20 overflow-hidden rounded-2xl border border-accent-400/30 bg-accent-400/8 shadow-md shadow-navy-900/5 dark:bg-accent-400/5">
               {mistakes.map((mistake) => (
                  <li
                     key={mistake}
                     className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent-400/10"
                  >
                     <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                     <span className="text-sm leading-7 text-navy-700 dark:text-navy-200">{mistake}</span>
                  </li>
               ))}
            </ul>
         </Reveal>
      </section>
   )
}
