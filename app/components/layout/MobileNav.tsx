"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/lib/store/store"
import { canViewAdmin } from "@/app/lib/permissions"
import HeaderNavLink from "./HeaderNavLink"

interface MobileNavProps {
   open: boolean
   onClose: () => void
}

const futureLinks = [
   { name: "Orders", href: "/orders" },
   { name: "Cart", href: "/cart" },
]

export default function MobileNav({ open, onClose }: MobileNavProps) {
   const user = useSelector((state: RootState) => state.auth.user)
   const showAdmin = user && canViewAdmin(user.permission)

   return (
      <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
         <DialogBackdrop
            transition
            className="fixed inset-0 bg-zinc-950/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
         />
         <div className="fixed inset-0 flex">
            <DialogPanel
               transition
               className="relative flex w-full max-w-72 flex-1 flex-col bg-white transition duration-300 ease-in-out data-closed:-translate-x-full dark:bg-zinc-950"
            >
               <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
                  <Link href="/" onClick={onClose} className="flex items-center gap-x-2.5">
                     <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M5 8h14l1 13H4L5 8Z" fill="white" className="dark:fill-zinc-950" />
                           <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round" className="dark:stroke-zinc-950" />
                        </svg>
                     </span>
                     <span className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                        Shopify
                     </span>
                  </Link>
                  <button
                     type="button"
                     onClick={onClose}
                     className="-m-2.5 p-2.5 text-zinc-600 dark:text-zinc-300"
                  >
                     <span className="sr-only">Close menu</span>
                     <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
               </div>
               <nav className="flex flex-1 flex-col gap-y-1 overflow-y-auto px-4 py-4">
                  <HeaderNavLink href="/" onClick={onClose}>
                     Home
                  </HeaderNavLink>
                  <HeaderNavLink href="/products" onClick={onClose}>
                     Products
                  </HeaderNavLink>
                  {user && (
                     <>
                        <HeaderNavLink href="/panel" onClick={onClose}>
                           My Panel
                        </HeaderNavLink>
                        {showAdmin && (
                           <HeaderNavLink href="/admin" onClick={onClose}>
                              Admin
                           </HeaderNavLink>
                        )}
                     </>
                  )}
                  <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
                  {futureLinks.map((item) => (
                     <HeaderNavLink key={item.name} href={item.href} onClick={onClose}>
                        {item.name}
                     </HeaderNavLink>
                  ))}
               </nav>
               {!user && (
                  <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                     <div className="flex flex-col gap-2">
                        <Link
                           href="/login"
                           onClick={onClose}
                           className="rounded-full border border-zinc-300 px-6 py-2.5 text-center text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                           Log in
                        </Link>
                        <Link
                           href="/register"
                           onClick={onClose}
                           className="rounded-full bg-black px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                           Sign up
                        </Link>
                     </div>
                  </div>
               )}
            </DialogPanel>
         </div>
      </Dialog>
   )
}
