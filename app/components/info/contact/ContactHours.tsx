import { ClockIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import SectionHeading from "@/app/components/ui/SectionHeading"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Support hours as a single card rather than a multi-row timetable.
 *
 * The store answers on one schedule every day, so a table with a row per day
 * would be five identical rows. The exact figure is kept in step with
 * `fa.footer.trust.supportHours`, which states the same hours further down the
 * same page.
 *
 * Intentionally not a live "we're online now" badge: that would have to be
 * computed against the visitor's clock, and a badge that disagrees with the
 * server during hydration is worse than no badge at all.
 */
export default function ContactHours() {
   const { hoursTitle, hoursSubtitle, hours } = fa.info.contact

   return (
      <section className="py-16">
         <SectionHeading title={hoursTitle} subtitle={hoursSubtitle} />

         <Reveal delay={0.08} className="mx-auto mt-10 max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface text-center shadow-md shadow-navy-900/5">
               <div className="bg-linear-to-bl from-brand-50 to-brand-100/50 px-6 py-8 dark:from-brand-500/10 dark:to-brand-500/5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25">
                     <ClockIcon className="h-6 w-6" aria-hidden="true" />
                  </span>

                  {/* No `dir="ltr"` here on purpose: the string is a Persian
                      phrase ("۸:۰۰ تا ۲۲:۰۰"), not a bare number, so it reads
                      start-to-end correctly in the page's own RTL flow. */}
                  <p className="mt-5 text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
                     {hours.time}
                  </p>
                  <p className="mt-2 text-sm font-medium text-navy-600 dark:text-navy-300">{hours.days}</p>
               </div>

               <div className="divide-y divide-border-subtle">
                  <p className="flex items-center justify-center gap-2 px-6 py-4 text-xs leading-6 text-navy-600 dark:text-navy-300">
                     <PaperAirplaneIcon className="h-4 w-4 shrink-0 text-brand-500 rtl:scale-x-[-1]" aria-hidden="true" />
                     {hours.telegram}
                  </p>
                  <p className="bg-navy-100/50 px-6 py-4 text-xs leading-6 text-navy-600 dark:bg-navy-800/40 dark:text-navy-300">
                     {hours.note}
                  </p>
               </div>
            </div>
         </Reveal>
      </section>
   )
}
