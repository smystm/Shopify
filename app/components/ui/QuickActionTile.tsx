import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

interface QuickActionTileProps {
   icon: ReactNode
   title: string
   body: string
   /** Trailing call-to-action line. Rendered without the arrow when disabled. */
   cta: string
   /** Required unless the tile is disabled. */
   href?: string
   /** Renders a non-interactive, muted tile with aria-disabled. */
   disabled?: boolean
   /** Small chip beside the title, e.g. «به‌زودی». */
   badge?: string
   className?: string
}

/**
 * Card-shaped shortcut used by the admin dashboard and the user panel.
 *
 * NOTE: the root carries `relative` on purpose — the brand wash child is
 * `absolute inset-0` and without a positioned root it would escape to the
 * viewport and wash the entire page on hover.
 */
export default function QuickActionTile({
   icon,
   title,
   body,
   cta,
   href,
   disabled = false,
   badge,
   className = "",
}: QuickActionTileProps) {
   const inert = disabled || !href

   const shell = [
      "group relative flex h-full items-start gap-4 rounded-2xl border p-6 transition-all duration-300",
      inert
         ? "cursor-not-allowed border-dashed border-navy-300 bg-surface-muted opacity-75 dark:border-navy-700 dark:bg-navy-900/40"
         : "border-border-strong bg-surface shadow-md shadow-navy-900/5 hover:-translate-y-1 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
      className,
   ]
      .filter(Boolean)
      .join(" ")

   const content = (
      <>
         {/* Brand wash — clipped to the card by the root's `relative`. */}
         {!inert ? (
            <span
               aria-hidden="true"
               className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-bl from-brand-500/[0.07] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
         ) : null}

         <span
            className={[
               "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300",
               inert
                  ? "bg-navy-200 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
                  : "bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 group-hover:scale-110",
            ].join(" ")}
         >
            {icon}
         </span>

         <div className="relative min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
               <h3
                  className={[
                     "text-base font-bold",
                     inert ? "text-navy-600 dark:text-navy-400" : "text-navy-950 dark:text-white",
                  ].join(" ")}
               >
                  {title}
               </h3>
               {badge ? (
                  <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[11px] font-bold text-accent-800 dark:text-accent-300">
                     {badge}
                  </span>
               ) : null}
            </div>

            <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-300">{body}</p>

            <span
               className={[
                  "mt-4 inline-flex items-center gap-1.5 text-sm font-bold",
                  inert ? "text-navy-600 dark:text-navy-400" : "text-brand-700 dark:text-brand-300",
               ].join(" ")}
            >
               {cta}
               {inert ? null : (
                  <ArrowLeftIcon
                     className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                     aria-hidden="true"
                  />
               )}
            </span>
         </div>
      </>
   )

   if (inert) {
      return (
         <div className={shell} aria-disabled="true">
            {content}
         </div>
      )
   }

   return (
      <Link href={href as string} className={shell}>
         {content}
      </Link>
   )
}