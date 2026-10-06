"use client"

import { useState } from "react"
import { Bars3Icon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useAppSelector } from "@/app/lib/store/hooks"
import { canViewAdmin } from "@/app/lib/permissions"
import HeaderNavLink from "./HeaderNavLink"
import UserMenu from "./UserMenu"
import MobileNav from "./MobileNav"

const futureLinks = [
   { name: "Orders", href: "/orders" },
   { name: "Cart", href: "/cart" },
]

export default function SiteHeader() {
   const [mobileOpen, setMobileOpen] = useState(false)
   const user = useAppSelector((s) => s.auth.user)
   const hydrated = useAppSelector((s) => s.auth.hydrated)
   const showAdmin = user && canViewAdmin(user.permission)

   return (
      <>
         <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-x-4 px-4 sm:px-6 lg:px-8">
               <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="-m-2.5 p-2.5 text-zinc-600 lg:hidden dark:text-zinc-300"
               >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="h-6 w-6" />
               </button>

               <Link href="/" className="flex items-center gap-x-2.5">
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

               <nav className="hidden items-center gap-x-1 lg:flex">
                  <HeaderNavLink href="/">Home</HeaderNavLink>
                  <HeaderNavLink href="/products">Products</HeaderNavLink>
                  {user && (
                     <>
                        <HeaderNavLink href="/panel">Panel</HeaderNavLink>
                        {showAdmin && <HeaderNavLink href="/admin">Admin</HeaderNavLink>}
                     </>
                  )}
                  {futureLinks.map((item) => (
                     <HeaderNavLink key={item.name} href={item.href}>
                        {item.name}
                     </HeaderNavLink>
                  ))}
               </nav>

               <div className="flex flex-1 justify-end items-center gap-x-3">
                  {hydrated && user ? (
                     <UserMenu />
                  ) : !hydrated ? null : (
                     <>
                        <Link
                           href="/login"
                           className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                           Log in
                        </Link>
                        <Link
                           href="/register"
                           className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                           Sign up
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
