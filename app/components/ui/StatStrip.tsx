import type { ReactNode } from "react"
import Reveal from "@/app/components/ui/Reveal"

export interface StatStripItem {
   /** Already formatted - Latin digits with separators, never a raw price. */
   value: string
   label: string
   icon?: ReactNode
}

interface StatStripProps {
   items: readonly StatStripItem[]
   /** 3 for a three-up summary, 4 when price bounds are included. */
   columns?: 3 | 4
   className?: string
}

const COLUMNS: Record<3 | 4, string> = {
   3: "grid-cols-1 sm:grid-cols-3",
   4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

/**
 * Row of bordered metric tiles.
 *
 * Deliberately takes pre-formatted strings rather than numbers: the price tiles
 * have to go through `formatToman` and must never be re-formatting a price on
 * their own, and a mixed set (count next to a price) has no single numeric type.
 */
export default function StatStrip({ items, columns = 3, className = "" }: StatStripProps) {
   return (
      <dl className={`grid gap-4 ${COLUMNS[columns]} ${className}`}>
         {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.07}>
               <div className="group h-full rounded-2xl border border-border-strong bg-surface px-5 py-6 text-center shadow-md shadow-navy-900/5 transition-colors hover:border-brand-400/70 dark:hover:border-brand-400/40">
                  {item.icon ? (
                     <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-500/10 dark:text-brand-300">
                        {item.icon}
                     </span>
                  ) : null}

                  <dd dir="ltr" className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-2xl font-extrabold text-transparent">
                     {item.value}
                  </dd>
                  <dt className="mt-1 text-xs font-medium text-navy-500 dark:text-navy-400">{item.label}</dt>
               </div>
            </Reveal>
         ))}
      </dl>
   )
}
