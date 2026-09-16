"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Bars3Icon, BellIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import { useDispatch, useSelector } from "react-redux"
import { removeLoginAuth } from "@/app/helpers/auth"
import { logout } from "@/app/lib/store/authSlice"
import type { RootState } from "@/app/lib/store/store"

interface AdminHeaderProps {
   onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
   const router = useRouter()
   const dispatch = useDispatch()
   const user = useSelector((state: RootState) => state.auth.user)
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])

   const displayName: string = user?.name || user?.email || user?.phone || "Admin"
   const displayDetail: string = user?.email || user?.phone || "Administrator"

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   return (
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white/80 px-4 shadow-xs backdrop-blur sm:gap-x-6 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950/80">
         <button
            type="button"
            onClick={onMenuClick}
            className="-m-2.5 p-2.5 text-zinc-600 lg:hidden dark:text-zinc-300"
         >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
         </button>

         <div aria-hidden="true" className="h-6 w-px bg-zinc-200 lg:hidden dark:bg-zinc-800" />

         <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="relative hidden flex-1 sm:flex">
               <label htmlFor="admin-search" className="sr-only">
                  Search
               </label>
               <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-zinc-400"
               />
               <input
                  id="admin-search"
                  name="search"
                  type="search"
                  placeholder="Search…"
                  className="block h-full w-full border-0 bg-transparent py-0 pr-0 pl-8 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:ring-0 dark:text-white dark:placeholder:text-zinc-500"
               />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
               <button
                  type="button"
                  className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
               >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
               </button>

               <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" />

               <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                     <span className="sr-only">Open user menu</span>
                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white uppercase dark:bg-white dark:text-zinc-950">
                        {displayName.slice(0, 1)}
                     </span>
                     <span className="hidden lg:flex lg:items-center">
                        <span aria-hidden="true" className="ml-4 text-left text-sm">
                           <span className="block font-semibold text-zinc-950 dark:text-white">{displayName}</span>
                           <span className="block text-xs text-zinc-500 dark:text-zinc-400">{displayDetail}</span>
                        </span>
                        <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-zinc-400" />
                     </span>
                  </MenuButton>
                  <MenuItems
                     transition
                     className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-900 dark:ring-white/10"
                  >
                     <MenuItem>
                        <button
                           type="button"
                           className="block w-full px-3 py-1 text-left text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:outline-hidden dark:text-zinc-200 dark:data-focus:bg-zinc-800"
                        >
                           Your profile
                        </button>
                     </MenuItem>
                     <MenuItem>
                        <button
                           type="button"
                           onClick={handleLogout}
                           className="block w-full px-3 py-1 text-left text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:outline-hidden dark:text-zinc-200 dark:data-focus:bg-zinc-800"
                        >
                           Sign out
                        </button>
                     </MenuItem>
                  </MenuItems>
               </Menu>
            </div>
         </div>
      </div>
   )
}
