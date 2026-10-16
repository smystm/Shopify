import { CheckIcon } from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"

interface BulletPanelProps {
   items: readonly string[]
   /** Numbers the rows instead of ticking them - for anything ordered. */
   ordered?: boolean
   className?: string
}

/**
 * Bordered panel of short points.
 *
 * Used for the "before you write to us" list and the trade-link mistakes, where
 * prose would bury the individual points that matter.
 */
export default function BulletPanel({ items, ordered = false, className = "" }: BulletPanelProps) {
   return (
      <Reveal className={className}>
         <ol className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
            {items.map((item, i) => (
               <li key={item} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-navy-100/50 dark:hover:bg-navy-800/40">
                  <span
                     aria-hidden="true"
                     className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  >
                     {ordered ? <span className="text-xs font-extrabold">{i + 1}</span> : <CheckIcon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-sm leading-7 text-navy-600 dark:text-navy-300">{item}</span>
               </li>
            ))}
         </ol>
      </Reveal>
   )
}
