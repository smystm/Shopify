"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

export interface PanelTabItem {
   /** Route under /panel, e.g. "/panel/orders". */
   href: string
   label: string
   icon: ReactNode
   /** Optional count shown as a pill — pending offers, order total, etc. */
   count?: number
}

interface PanelTabsProps {
   items: PanelTabItem[]
   /** Accessible name for the nav landmark. */
   label: string
   className?: string
}

/**
 * Horizontal tab bar for the customer panel.
 *
 * Uses a shared `layoutId` pill so the active background slides between tabs,
 * matching the header nav, admin sidebar and auth mode toggle.
 */
export default function PanelTabs({ items, label, className = "" }: PanelTabsProps) {
   const pathname = usePathname()
   const prefersReduced = useReducedMotion()

   return (
      <nav aria-label={label} className={`-mx-1 ${className}`}>
         {/* Horizontally scrollable on small screens rather than wrapping badly. */}
         <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border-subtle bg-surface p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
               const active = pathname === item.href
               return (
                  <Link
                     key={item.href}
                     href={item.href}
                     aria-current={active ? "page" : undefined}
                     className={[
                        "relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors duration-300",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                        active ? "text-white" : "text-navy-600 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-200",
                     ].join(" ")}
                  >
                     {active ? (
                        <motion.span
                           aria-hidden="true"
                           layoutId="panel-tab-pill"
                           className="absolute inset-0 rounded-xl bg-linear-to-l from-brand-700 to-brand-800 shadow-md shadow-brand-700/25"
                           transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                        />
                     ) : null}

                     <span className="relative flex h-5 w-5 items-center justify-center">{item.icon}</span>
                     <span className="relative whitespace-nowrap">{item.label}</span>

                     {item.count !== undefined && item.count > 0 ? (
                        <span
                           className={[
                              "relative rounded-full px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums",
                              active ? "bg-black/25 text-white" : "bg-brand-500/15 text-brand-700 dark:text-brand-300",
                           ].join(" ")}
                        >
                           {item.count.toLocaleString("fa-IR")}
                        </span>
                     ) : null}
                  </Link>
               )
            })}
         </div>
      </nav>
   )
}