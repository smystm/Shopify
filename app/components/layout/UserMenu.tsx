"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import { useDispatch, useSelector } from "react-redux"
import { removeLoginAuth } from "@/app/helpers/auth"
import { logout } from "@/app/lib/store/authSlice"
import type { RootState } from "@/app/lib/store/store"
import { canViewAdmin } from "@/app/lib/permissions"
import { fa } from "@/app/lib/i18n/fa"

export default function UserMenu() {
   const router = useRouter()
   const dispatch = useDispatch()
   const user = useSelector((state: RootState) => state.auth.user)
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])

   const displayName: string = user?.name || user?.email || user?.phone || fa.header.fallbackUserName
   const displayDetail: string = user?.email || user?.phone || ""
   const showAdmin = canViewAdmin(user?.permission)

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   // Headless UI drives `data-focus`, so keyboard nav keeps working.
   const itemClass =
      "block w-full rounded-lg px-4 py-2 text-start text-sm transition-colors duration-200 data-focus:outline-hidden"

   return (
      <Menu as="div" className="relative">
         <MenuButton className="group -m-1.5 flex items-center gap-x-2 rounded-full p-1.5 transition-colors hover:bg-navy-100 dark:hover:bg-navy-800">
            <span className="sr-only">{fa.header.openUserMenu}</span>

            {/* Avatar with a gradient ring */}
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 p-px">
               <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-extrabold text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-navy-950 dark:text-brand-300">
                  {displayName.slice(0, 1)}
               </span>
            </span>

            <span className="hidden items-center sm:flex">
               <span className="ms-2 text-start text-sm">
                  <span className="block font-bold text-navy-950 dark:text-white">{displayName}</span>
                  {displayDetail && <span className="block text-xs text-navy-500 dark:text-navy-400">{displayDetail}</span>}
               </span>
               <ChevronDownIcon
                  aria-hidden="true"
                  className="ms-1 h-4 w-4 text-navy-400 transition-transform duration-300 group-data-open:rotate-180"
               />
            </span>
         </MenuButton>

         <MenuItems
            transition
            className="absolute end-0 z-50 mt-2.5 w-56 origin-top-right rounded-2xl border border-navy-200/70 bg-white/95 p-2 shadow-2xl shadow-navy-900/10 backdrop-blur-xl transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 rtl:origin-top-left dark:border-navy-700/60 dark:bg-navy-900/95 dark:shadow-black/40"
         >
            <div className="mb-1 rounded-xl bg-gradient-to-bl from-brand-50 to-accent-50 px-3 py-2.5 dark:from-brand-500/10 dark:to-accent-500/10">
               <p className="text-sm font-bold text-navy-950 dark:text-white">{displayName}</p>
               {displayDetail && <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{displayDetail}</p>}
            </div>

            <MenuItem>
               <Link href="/panel" className={`${itemClass} text-navy-700 data-focus:bg-brand-50 dark:text-navy-200 dark:data-focus:bg-navy-800`}>
                  {fa.nav.myPanel}
               </Link>
            </MenuItem>

            {showAdmin ? (
               <MenuItem>
                  <Link
                     href="/admin"
                     className={`${itemClass} text-navy-700 data-focus:bg-brand-50 dark:text-navy-200 dark:data-focus:bg-navy-800`}
                  >
                     {fa.nav.adminDashboard}
                  </Link>
               </MenuItem>
            ) : null}

            <MenuItem>
               <button
                  type="button"
                  onClick={handleLogout}
                  className={`${itemClass} text-red-600 data-focus:bg-red-50 dark:text-red-400 dark:data-focus:bg-red-950/40`}
               >
                  {fa.auth.logout}
               </button>
            </MenuItem>
         </MenuItems>
      </Menu>
   )
}