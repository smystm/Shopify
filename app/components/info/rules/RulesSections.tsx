import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Reading order for the rule groups.
 *
 * Written out rather than taken from `Object.keys` so the sequence follows the
 * life of an order - account, then payment, then delivery - instead of whatever
 * order the strings happen to sit in inside the i18n file.
 */
const SECTION_ORDER = ["account", "payment", "delivery", "refund", "prohibited", "changes"] as const

/**
 * The rulebook, as numbered groups of short clauses.
 *
 * Clauses are bulleted rather than run together as prose because that is how
 * these pages get read: people jump to the one rule they care about, and a wall
 * of paragraphs makes that harder than a list does.
 */
export default function RulesSections() {
   const copy = fa.info.rules

   return (
      <section className="py-16">
         <Reveal className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-medium text-navy-600 shadow-sm dark:text-navy-300">
            <CalendarDaysIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
            {copy.updatedLabel}: <span className="font-bold text-navy-900 dark:text-white">{copy.updatedValue}</span>
         </Reveal>

         <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {SECTION_ORDER.map((key, i) => {
               const section = copy.sections[key]

               return (
                  <Reveal key={key} as="li" delay={i * 0.06} className="list-none h-full">
                     <article className="group flex h-full flex-col rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400/70 dark:hover:border-brand-400/40">
                        <header className="flex items-center gap-3">
                           <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-extrabold text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-500/10 dark:text-brand-300">
                              {i + 1}
                           </span>
                           <h2 className="text-base font-bold text-navy-900 dark:text-white">{section.title}</h2>
                        </header>

                        <ul className="mt-5 space-y-3 border-s-2 border-brand-500/20 ps-5">
                           {section.items.map((item) => (
                              <li key={item} className="flex items-start gap-3 text-sm leading-7 text-navy-600 dark:text-navy-300">
                                 <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                                 {item}
                              </li>
                           ))}
                        </ul>
                     </article>
                  </Reveal>
               )
            })}
         </ol>
      </section>
   )
}
