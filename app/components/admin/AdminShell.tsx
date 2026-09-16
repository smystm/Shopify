"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { ReactNode } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebarContent from "./AdminSidebarContent"

interface AdminShellProps {
   children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const pathname = usePathname() ?? "/admin"

   return (
      <div className="min-h-full bg-zinc-50 dark:bg-black">
         <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
            <DialogBackdrop
               transition
               className="fixed inset-0 bg-zinc-950/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />
            <div className="fixed inset-0 flex">
               <DialogPanel
                  transition
                  className="relative mr-16 flex w-full max-w-72 flex-1 transition duration-300 ease-in-out data-closed:-translate-x-full"
               >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                     <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="-m-2.5 p-2.5 text-white"
                     >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                     </button>
                  </div>
                  <AdminSidebarContent currentPath={pathname} onNavigate={() => setSidebarOpen(false)} />
               </DialogPanel>
            </div>
         </Dialog>

         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <AdminSidebarContent currentPath={pathname} />
         </div>

         <div className="lg:pl-72">
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
            <main className="py-10">
               <div className="px-4 text-base sm:px-6 lg:px-8">{children}</div>
            </main>
         </div>
      </div>
   )
}
