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

export default function UserMenu() {
   const router = useRouter()
   const dispatch = useDispatch()
   const user = useSelector((state: RootState) => state.auth.user)
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])

   const displayName: string = user?.name || user?.email || user?.phone || "User"
   const displayDetail: string = user?.email || user?.phone || ""
   const showAdmin = canViewAdmin(user?.permission)

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   return (
      <Menu as="div" className="relative">
         <MenuButton className="-m-1.5 flex items-center gap-x-2 rounded-full p-1.5 transition hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <span className="sr-only">Open user menu</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white uppercase dark:bg-white dark:text-zinc-950">
               {displayName.slice(0, 1)}
            </span>
            <span className="hidden items-center sm:flex">
               <span className="ml-2 text-left text-sm">
                  <span className="block font-semibold text-zinc-950 dark:text-white">{displayName}</span>
                  {displayDetail && (
                     <span className="block text-xs text-zinc-500 dark:text-zinc-400">{displayDetail}</span>
                  )}
               </span>
               <ChevronDownIcon aria-hidden="true" className="ml-1 h-4 w-4 text-zinc-400" />
            </span>
         </MenuButton>
         <MenuItems
            transition
            className="absolute right-0 z-50 mt-2.5 w-52 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-900 dark:ring-white/10"
         >
            <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
               <p className="text-sm font-semibold text-zinc-950 dark:text-white">{displayName}</p>
               {displayDetail && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{displayDetail}</p>
               )}
            </div>
            <MenuItem>
               <Link
                  href="/panel"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:outline-hidden dark:text-zinc-200 dark:data-focus:bg-zinc-800"
               >
                  My Panel
               </Link>
            </MenuItem>
            {showAdmin && (
               <MenuItem>
                  <Link
                     href="/admin"
                     className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:outline-hidden dark:text-zinc-200 dark:data-focus:bg-zinc-800"
                  >
                     Admin Dashboard
                  </Link>
               </MenuItem>
            )}
            <MenuItem>
               <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 data-focus:bg-zinc-100 data-focus:outline-hidden dark:text-red-400 dark:data-focus:bg-zinc-800"
               >
                  Sign out
               </button>
            </MenuItem>
         </MenuItems>
      </Menu>
   )
}
