import Link from "next/link"
import { ArrowLeftIcon, IdentificationIcon } from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The one action this page is actually arguing for.
 *
 * Not an `InfoCta` band: the page already closes with one of those, and the
 * point here is narrower - the field exists, here is where to paste the link -
 * so it reads as a highlighted panel rather than a second farewell.
 */
export default function TradeLinkPanelCta() {
   const { panelTitle, panelBody, panelAction } = fa.info.tradeLink

   return (
      <Reveal className="mx-auto max-w-3xl py-16">
         <div className="flex flex-col items-center gap-6 rounded-3xl border border-brand-400/30 bg-linear-to-bl from-brand-50 to-brand-100/60 px-8 py-10 text-center shadow-lg shadow-brand-700/5 sm:flex-row sm:text-start dark:border-brand-400/20 dark:from-brand-500/10 dark:to-brand-500/5">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-xl shadow-brand-700/25">
               <IdentificationIcon className="h-7 w-7" aria-hidden="true" />
            </span>

            <div className="grow">
               <h2 className="text-lg font-bold text-navy-900 dark:text-white">{panelTitle}</h2>
               <p className="mt-2 text-sm leading-7 text-navy-600 dark:text-navy-300">{panelBody}</p>
            </div>

            <Link
               href="/panel/profile"
               className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
               {panelAction}
               <ArrowLeftIcon
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                  aria-hidden="true"
               />
            </Link>
         </div>
      </Reveal>
   )
}
