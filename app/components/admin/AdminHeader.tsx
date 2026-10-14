"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Bars3Icon, BellIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { motion, useScroll, useTransform } from "motion/react"
import { removeLoginAuth } from "@/app/helpers/auth"
import { logout } from "@/app/lib/store/authSlice"
import { useMounted } from "@/app/lib/hooks/useMounted"
import useAuth from "@/app/lib/store/useAuth"
import ThemeToggle from "@/app/components/ThemeToggle"
import { fa } from "@/app/lib/i18n/fa"

interface AdminHeaderProps {
   onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
   const router = useRouter()
   const dispatch = useDispatch()
   const mounted = useMounted()
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])
   // Refresh the Redux user/permission from the backend while the admin shell is open.
   const auth = useAuth()

   // See the note in SiteHeader. SWR cannot run during SSR at all, so the
   // backend value has to wait until this header has hydrated before it is used.
   const effectiveUser = mounted ? auth.user : null
   const displayName: string = effectiveUser?.name || effectiveUser?.email || effectiveUser?.phone || fa.admin.header.fallbackName
   const displayDetail: string = effectiveUser?.email || effectiveUser?.phone || fa.admin.header.fallbackRole

   // Scroll-driven via motion values — no React state, no effect.
   const { scrollY } = useScroll()
   const hairlineScale = useTransform(scrollY, [0, 60], [0, 1])
   const shadowOpacity = useTransform(scrollY, [0, 60], [0, 0.08])

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   return (
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border-subtle bg-surface/90 px-4 backdrop-blur-xl sm:gap-x-6 sm:px-6 lg:px-8">
         {/* Brand gradient hairline */}
         <motion.span
            aria-hidden="true"
            style={{ scaleX: hairlineScale, opacity: hairlineScale }}
            className="absolute inset-x-0 bottom-0 h-px origin-right bg-linear-to-l from-brand-500 via-brand-400 to-accent-400 rtl:origin-left"
         />
         <motion.span
            aria-hidden="true"
            style={{ opacity: shadowOpacity }}
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-navy-900/60 to-transparent"
         />

         <button
            type="button"
            onClick={onMenuClick}
            className="-m-2.5 rounded-xl p-2.5 text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 lg:hidden dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-brand-300"
         >
            <span className="sr-only">{fa.admin.header.openSidebar}</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
         </button>

         <div aria-hidden="true" className="h-6 w-px bg-border-subtle lg:hidden" />

         <div className="flex flex-1 items-center justify-end gap-x-3 self-stretch sm:gap-x-5">
            <form action="#" method="GET" className="relative hidden max-w-md flex-1 sm:flex">
               <label htmlFor="admin-search" className="sr-only">
                  {fa.admin.header.search}
               </label>
               <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 inset-s-0 my-auto h-5 w-5 text-navy-400"
               />
               <input
                  id="admin-search"
                  name="search"
                  type="search"
                  placeholder={fa.admin.header.searchPlaceholder}
                  className="block h-10 w-full rounded-full border border-border-subtle bg-navy-100/60 ps-10 pe-4 text-sm text-navy-950 transition-colors outline-none placeholder:text-navy-500 focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/20 dark:bg-navy-900/60 dark:text-white dark:placeholder:text-navy-400"
               />
            </form>

            <div className="flex items-center gap-x-3 lg:gap-x-5">
               <button
                  type="button"
                  className="-m-2.5 rounded-xl p-2.5 text-navy-400 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:hover:bg-navy-800 dark:hover:text-brand-300"
               >
                  <span className="sr-only">{fa.admin.header.notifications}</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
               </button>

               <ThemeToggle />

               <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-border-subtle" />

               <Menu as="div" className="relative">
                  <MenuButton className="group -m-1.5 flex items-center gap-x-2 rounded-full p-1.5 transition-colors hover:bg-navy-100 dark:hover:bg-navy-800">
                     <span className="sr-only">{fa.admin.header.openUserMenu}</span>
                     <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-brand-600 to-brand-700 p-px">
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-surface text-xs font-extrabold text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-navy-950 dark:text-brand-300">
                           {displayName.slice(0, 1)}
                        </span>
                     </span>
                     <span className="hidden lg:flex lg:items-center">
                        <span aria-hidden="true" className="ms-2 text-start text-sm">
                           <span className="block font-bold text-navy-950 dark:text-white">{displayName}</span>
                           <span className="block text-xs text-navy-500 dark:text-navy-400">{displayDetail}</span>
                        </span>
                        <ChevronDownIcon
                           aria-hidden="true"
                           className="ms-1 h-5 w-5 text-navy-400 transition-transform duration-300 group-data-open:rotate-180"
                        />
                     </span>
                  </MenuButton>

                  <MenuItems
                     transition
                     className="absolute inset-end-0 z-10 mt-2.5 w-52 origin-top-right rounded-2xl border border-border-strong bg-surface p-2 shadow-2xl shadow-navy-900/10 transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 rtl:origin-top-left dark:shadow-black/40"
                  >
                     <div className="mb-1 rounded-xl bg-linear-to-bl from-brand-50 to-accent-50 px-3 py-2.5 dark:from-brand-500/10 dark:to-accent-500/10">
                        <p className="text-sm font-bold text-navy-950 dark:text-white">{displayName}</p>
                        <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{displayDetail}</p>
                     </div>
                     <MenuItem>
                        <button
                           type="button"
                           className="block w-full rounded-lg px-3 py-2 text-start text-sm text-navy-700 transition-colors data-focus:bg-brand-50 data-focus:outline-hidden dark:text-navy-200 dark:data-focus:bg-navy-800"
                        >
                           {fa.admin.header.yourProfile}
                        </button>
                     </MenuItem>
                     <MenuItem>
                        <button
                           type="button"
                           onClick={handleLogout}
                           className="block w-full rounded-lg px-3 py-2 text-start text-sm text-red-600 transition-colors data-focus:bg-red-50 data-focus:outline-hidden dark:text-red-400 dark:data-focus:bg-red-950/40"
                        >
                           {fa.admin.header.signOut}
                        </button>
                     </MenuItem>
                  </MenuItems>
               </Menu>
            </div>
         </div>
      </div>
   )
}