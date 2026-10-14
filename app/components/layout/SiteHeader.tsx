"use client"

import { useState } from "react"
import { Bars3Icon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { motion, useScroll, useTransform } from "motion/react"
import { useAppSelector } from "@/app/lib/store/hooks"
import { canViewAdmin } from "@/app/lib/permissions"
import HeaderNavLink from "./HeaderNavLink"
import UserMenu from "./UserMenu"
import MobileNav from "./MobileNav"
import BrandMark from "./BrandMark"
import ThemeToggle from "@/app/components/ThemeToggle"
import { fa, faNavLinks } from "@/app/lib/i18n/fa"

export default function SiteHeader() {
   const [mobileOpen, setMobileOpen] = useState(false)
   const user = useAppSelector((s) => s.auth.user)
   const hydrated = useAppSelector((s) => s.auth.hydrated)
   const showAdmin = user && canViewAdmin(user.permission)

   // Scroll-driven via motion values (no React state => no effect needed).
   // `hydrated` starts as false, so the auth area renders nothing during SSR
   // and on the first client render — a separate `mounted` flag is redundant.
   const { scrollY } = useScroll()
   const hairlineScale = useTransform(scrollY, [0, 60], [0, 1])
   const shadowOpacity = useTransform(scrollY, [0, 60], [0, 0.08])

   return (
      <>
         <header
            dir="rtl"
            lang="fa"
            className="sticky top-0 z-40 border-b border-border-strong bg-surface/90 font-vazirmatn backdrop-blur-xl dark:border-navy-800/60 dark:bg-navy-950/80"
         >
            {/* Brand gradient hairline — fades in once you scroll */}
            <motion.span
               aria-hidden="true"
               style={{ scaleX: hairlineScale, opacity: hairlineScale }}
               className="absolute inset-x-0 bottom-0 h-px origin-right bg-linear-to-l from-brand-500 via-brand-400 to-accent-400 rtl:origin-left"
            />
            <motion.span aria-hidden="true" style={{ opacity: shadowOpacity }} className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-navy-900/60 to-transparent" />

            <div className="mx-auto flex h-16 max-w-7xl items-center gap-x-4 px-4 sm:px-6 lg:px-8">
               <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="-m-2.5 rounded-xl p-2.5 text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 lg:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-brand-300"
               >
                  <span className="sr-only">{fa.header.openMenu}</span>
                  <Bars3Icon aria-hidden="true" className="h-6 w-6" />
               </button>

               <BrandMark />

               <nav className="hidden items-center gap-x-1 ps-6 lg:flex">
                  <HeaderNavLink href="/">{fa.nav.home}</HeaderNavLink>
                  <HeaderNavLink href="/products">{fa.nav.products}</HeaderNavLink>
                  {user && (
                     <>
                        <HeaderNavLink href="/panel">{fa.nav.panel}</HeaderNavLink>
                        {showAdmin && <HeaderNavLink href="/admin">{fa.nav.admin}</HeaderNavLink>}
                     </>
                  )}
                  {faNavLinks.map((item) => (
                     <HeaderNavLink key={item.name} href={item.href}>
                        {item.name}
                     </HeaderNavLink>
                  ))}
               </nav>

               <div className="flex flex-1 items-center justify-end gap-x-2.5">
                  <ThemeToggle />
                  {hydrated && user ? (
                     <UserMenu />
                  ) : !hydrated ? null : (
                     <>
                        <Link
                           href="/login"
                           className="rounded-full border border-navy-300 bg-surface px-5 py-2 text-sm font-semibold text-navy-700 transition-all duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-navy-600 dark:text-navy-200 dark:hover:border-brand-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                        >
                           {fa.auth.login}
                        </Link>
                        <Link
                           href="/register"
                           className="group relative overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-brand-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                           <span
                              aria-hidden="true"
                              className="absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                           />
                           <span className="relative">{fa.auth.signup}</span>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </header>

         <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </>
   )
}