"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { adminNavigation, isNavItemActive } from "@/app/lib/adminNavigation"
import BrandMark from "@/app/components/layout/BrandMark"
import { fa, faAdminNavLabel } from "@/app/lib/i18n/fa"

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

interface AdminSidebarContentProps {
   currentPath: string
   onNavigate?: () => void
}

export default function AdminSidebarContent({ currentPath, onNavigate }: AdminSidebarContentProps) {
   const prefersReduced = useReducedMotion()

   return (
      <div className="flex grow flex-col gap-y-6 overflow-y-auto border-e border-border-subtle bg-surface px-5 pb-5">
         <div className="flex h-16 shrink-0 items-center">
            <BrandMark onClick={onNavigate} />
         </div>

         <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
               <li>
                  <ul role="list" className="space-y-1">
                     {adminNavigation.map((item) => {
                        const active = isNavItemActive(item.href, currentPath)
                        return (
                           <li key={item.name}>
                              <motion.span
                                 whileHover={prefersReduced ? undefined : { x: -4 }}
                                 transition={{ type: "spring", stiffness: 380, damping: 26 }}
                                 className="block"
                              >
                                 <Link
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? "page" : undefined}
                                    className={classNames(
                                       "group relative flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-300",
                                       active
                                          ? "font-bold text-brand-700 dark:text-brand-300"
                                          : "font-semibold text-navy-600 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300",
                                    )}
                                 >
                                    {active ? (
                                       <motion.span
                                          layoutId="admin-sidebar-active"
                                          aria-hidden="true"
                                          className="absolute inset-0 -z-10 rounded-xl bg-brand-500/12 ring-1 ring-brand-500/25 dark:bg-brand-400/15 dark:ring-brand-400/30"
                                          transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                                       />
                                    ) : (
                                       <span
                                          aria-hidden="true"
                                          className="absolute inset-0 -z-10 rounded-xl bg-navy-100/0 transition-colors duration-300 group-hover:bg-navy-100/70 dark:group-hover:bg-navy-800/60"
                                       />
                                    )}

                                    <item.icon
                                       aria-hidden="true"
                                       className={classNames(
                                          "h-5 w-5 shrink-0 transition-colors duration-300",
                                          active
                                             ? "text-brand-600 dark:text-brand-400"
                                             : "text-navy-400 group-hover:text-brand-600 dark:group-hover:text-brand-400",
                                       )}
                                    />
                                    <span className="relative">{faAdminNavLabel(item.href, item.name)}</span>
                                 </Link>
                              </motion.span>
                           </li>
                        )
                     })}
                  </ul>
               </li>

               <li className="mt-auto">
                  <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-linear-to-bl from-brand-50 to-accent-50 p-4 dark:border-brand-400/15 dark:from-brand-500/10 dark:to-accent-500/10">
                     <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-end-8 -top-8 h-24 w-24 rounded-full bg-brand-400/25 blur-2xl"
                     />
                     <p className="relative text-xs font-bold text-navy-900 dark:text-white">{fa.admin.sidebar.workspaceTitle}</p>
                     <p className="relative mt-1 text-xs leading-5 text-navy-600 dark:text-navy-300">{fa.admin.sidebar.workspaceBody}</p>
                  </div>
               </li>
            </ul>
         </nav>
      </div>
   )
}