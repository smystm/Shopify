"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

interface HeaderNavLinkProps {
   href: string
   children: React.ReactNode
   onClick?: () => void
}

export default function HeaderNavLink({ href, children, onClick }: HeaderNavLinkProps) {
   const pathname = usePathname()
   const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))

   return (
      <Link
         href={href}
         onClick={onClick}
         className={classNames(
            active
               ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white"
               : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-white",
            "rounded-md px-3 py-2 text-sm font-semibold transition",
         )}
      >
         {children}
      </Link>
   )
}
