"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/lib/store/store"
import { useMounted } from "@/app/lib/hooks/useMounted"
import { canViewAdmin } from "@/app/lib/permissions"
import HeaderNavLink from "./HeaderNavLink"
import BrandMark from "./BrandMark"
import { fa, faNavLinks } from "@/app/lib/i18n/fa"

interface MobileNavProps {
   open: boolean
   onClose: () => void
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
   const user = useSelector((state: RootState) => state.auth.user)
   const showAdmin = user && canViewAdmin(user.permission)
   const prefersReduced = useReducedMotion()

   // See the note in SiteHeader: this drawer has to render exactly what the
   // server rendered until React has finished hydrating it.
   const mounted = useMounted()
   const signedIn = mounted && Boolean(user)

   // Direction-neutral (opacity + small Y) so it behaves the same in RTL and LTR.
   const list = {
      hidden: {},
      show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
   }
   const row = {
      hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
   }

   return (
      <Dialog dir="rtl" open={open} onClose={onClose} className="relative z-50 xl:hidden">
         <DialogBackdrop
            transition
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
         />

         <div className="fixed inset-0 flex">
            <DialogPanel
               transition
               dir="rtl"
               lang="fa"
               className="relative flex w-full max-w-80 flex-1 flex-col border-s border-border-strong bg-surface font-vazirmatn transition duration-300 ease-in-out data-closed:-translate-x-full rtl:data-closed:translate-x-full dark:border-navy-800/60 dark:bg-navy-950"
            >
               {/* Brand wash at the top of the drawer */}
               <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brand-500/10 to-transparent dark:from-brand-400/10" />

               <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-navy-200/60 px-4 dark:border-navy-800/60">
                  <BrandMark onClick={onClose} />
                  <button
                     type="button"
                     onClick={onClose}
                     className="-m-2.5 rounded-xl p-2.5 text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-brand-300"
                  >
                     <span className="sr-only">{fa.header.closeMenu}</span>
                     <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
               </div>

               <motion.nav
                  variants={list}
                  initial="hidden"
                  animate={open ? "show" : "hidden"}
                  className="relative flex flex-1 flex-col gap-y-1 overflow-y-auto px-4 py-4"
               >
                  <motion.div variants={row}>
                     <HeaderNavLink href="/" variant="drawer" onClick={onClose}>
                        {fa.nav.home}
                     </HeaderNavLink>
                  </motion.div>
                  <motion.div variants={row}>
                     <HeaderNavLink href="/products" variant="drawer" onClick={onClose}>
                        {fa.nav.products}
                     </HeaderNavLink>
                  </motion.div>
                  <motion.div variants={row}>
                     <HeaderNavLink href="/prime" variant="drawer" onClick={onClose}>
                        {fa.nav.prime}
                     </HeaderNavLink>
                  </motion.div>
                  <motion.div variants={row}>
                     <HeaderNavLink href="/tf2-keys" variant="drawer" onClick={onClose}>
                        {fa.nav.Tf2Keys}
                     </HeaderNavLink>
                  </motion.div>

                  {signedIn && (
                     <>
                        <motion.div variants={row}>
                           <HeaderNavLink href="/panel" variant="drawer" onClick={onClose}>
                              {fa.nav.myPanel}
                           </HeaderNavLink>
                        </motion.div>
                        {showAdmin && (
                           <motion.div variants={row}>
                              <HeaderNavLink href="/admin" variant="drawer" onClick={onClose}>
                                 {fa.nav.admin}
                              </HeaderNavLink>
                           </motion.div>
                        )}
                     </>
                  )}

                  <motion.div variants={row}>
                     <HeaderNavLink href="/about" variant="drawer" onClick={onClose}>
                        {fa.nav.about}
                     </HeaderNavLink>
                  </motion.div>
                  <motion.div variants={row}>
                     <HeaderNavLink href="/contact" variant="drawer" onClick={onClose}>
                        {fa.nav.contact}
                     </HeaderNavLink>
                  </motion.div>

                  <motion.div variants={row} className="my-2 border-t border-navy-100 dark:border-navy-800" />

                  {faNavLinks.map((item) => (
                     <motion.div key={item.name} variants={row}>
                        <HeaderNavLink href={item.href} variant="drawer" onClick={onClose}>
                           {item.name}
                        </HeaderNavLink>
                     </motion.div>
                  ))}
               </motion.nav>

               {/* Auth CTAs appear only once this drawer has hydrated, so the server
                    and the client produce the same markup. */}
                  {mounted && !signedIn && (
                  <div className="relative border-t border-navy-200/60 p-4 dark:border-navy-800/60">
                     <div className="flex flex-col gap-2.5">
                        <Link
                           href="/login"
                           onClick={onClose}
                           className="rounded-full border border-navy-300 bg-surface px-6 py-2.5 text-center text-sm font-semibold text-navy-700 transition-all duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-navy-600 dark:text-navy-200 dark:hover:border-brand-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                        >
                           {fa.auth.login}
                        </Link>
                        <Link
                           href="/register"
                           onClick={onClose}
                           className="group relative overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-6 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/45"
                        >
                           <span
                              aria-hidden="true"
                              className="absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                           />
                           <span className="relative">{fa.auth.signup}</span>
                        </Link>
                     </div>
                  </div>
               )}
            </DialogPanel>
         </div>
      </Dialog>
   )
}