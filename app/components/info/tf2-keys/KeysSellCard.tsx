import { BanknotesIcon, BoltIcon, PaperAirplaneIcon, ScaleIcon } from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"
import { SELL_TELEGRAM_BOT_URL } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

/**
 * "Sell to us" beside the buy calculator.
 *
 * A TF2 key has a lived-in market in both directions: the same player who buys
 * keys to open crates often ends up holding more than they need. The calculator
 * answers the buyer; this card answers the seller, and hands them to the
 * purchase bot rather than the support desk - a sale is an offer to price and
 * accept, not a question to answer.
 *
 * Deliberately static: nothing here depends on the service_prices row. A seller
 * names a quantity to the bot, so a number stored for the *buyer* side of the
 * market would only mislead on this card.
 */
export default function KeysSellCard() {
   const copy = fa.info.tf2Keys.sell
   const points = [
      { Icon: ScaleIcon, ...copy.points.price },
      { Icon: BanknotesIcon, ...copy.points.wallet },
      { Icon: BoltIcon, ...copy.points.speed },
   ]

   return (
      <section className="flex h-full items-stretch px-4 py-10 lg:px-0 lg:py-16">
         <Reveal className="w-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10">
               {/* The same grid texture the product headers use, with the emerald
                   wash reserved for money moving toward the customer. */}
               <span aria-hidden="true" className="hero-card-grid pointer-events-none absolute inset-0 opacity-30" />
               <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -start-24 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 lg:opacity-70"
               />

               <div className="relative flex items-center gap-2 px-7 pt-7">
                  <span className="rounded-full bg-emerald-600/12 px-3 py-1 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300">
                     {copy.badge}
                  </span>
               </div>

               <div className="relative px-7 pb-7 pt-3">
                  <h3 className="text-lg font-extrabold tracking-tight text-navy-950 dark:text-white">
                     {copy.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-navy-600 dark:text-navy-300">
                     {copy.body}
                  </p>

                  <ul className="mt-5 space-y-4">
                     {points.map(({ Icon, title, body }) => (
                        <li key={title} className="flex items-start gap-3">
                           <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600/15 dark:text-emerald-300">
                              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                           </span>
                           <span className="min-w-0">
                              <span className="block text-sm font-bold text-navy-950 dark:text-white">{title}</span>
                              <span className="mt-0.5 block text-xs leading-6 text-navy-500 dark:text-navy-400">{body}</span>
                           </span>
                        </li>
                     ))}
                  </ul>

                  <a
                     href={SELL_TELEGRAM_BOT_URL}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-l from-emerald-700 to-emerald-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                     <PaperAirplaneIcon className="h-5 w-5 rtl:scale-x-[-1]" aria-hidden="true" />
                     {copy.cta}
                  </a>
                  <p className="mt-3 text-center text-[11px] leading-5 text-navy-500 dark:text-navy-400">
                     {copy.hint}
                  </p>
               </div>
            </div>
         </Reveal>
      </section>
   )
}
