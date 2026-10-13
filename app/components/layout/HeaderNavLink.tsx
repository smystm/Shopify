"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

interface HeaderNavLinkProps {
   href: string
   children: React.ReactNode
   onClick?: () => void
   /** Inactive weight/size — the drawer uses a roomier variant. */
   variant?: "nav" | "drawer"
}

export default function HeaderNavLink({ href, children, onClick, variant = "nav" }: HeaderNavLinkProps) {
   const pathname = usePathname()
   const prefersReduced = useReducedMotion()
   const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))

   const isDrawer = variant === "drawer"

   return (
      <Link
         href={href}
         onClick={onClick}
         aria-current={active ? "page" : undefined}
         className={classNames(
            "group relative isolate transition-colors duration-300",
            isDrawer
               ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
               : "rounded-full px-4 py-2 text-sm font-semibold",
            active
               ? "font-bold text-brand-700 dark:text-brand-300"
               : "text-navy-600 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300",
         )}
      >
         {active ? (
            // Shared layoutId => the pill springs between links instead of snapping.
            <motion.span
               layoutId="header-active-pill"
               aria-hidden="true"
               className={classNames(
                  "absolute inset-0 -z-10 bg-brand-500/12 ring-1 ring-brand-500/25 dark:bg-brand-400/15 dark:ring-brand-400/30",
                  isDrawer ? "rounded-xl" : "rounded-full",
               )}
               transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
            />
         ) : null}

         {/* Hover wash (nav variant only — the drawer row fills on hover instead). */}
         {isDrawer ? (
            <span
               aria-hidden="true"
               className="absolute inset-0 -z-10 rounded-xl bg-navy-100/0 transition-colors duration-300 group-hover:bg-navy-100/70 dark:group-hover:bg-navy-800/60"
            />
         ) : null}

         {isDrawer && active ? (
            <span aria-hidden="true" className="absolute inset-y-2 start-0 w-1 rounded-full bg-brand-500" />
         ) : null}

         <span className="relative">{children}</span>
      </Link>
   )
}