"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { motion, useReducedMotion } from "motion/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { ReactNode } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebarContent from "./AdminSidebarContent"
import { fa } from "@/app/lib/i18n/fa"

interface AdminShellProps {
   children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const pathname = usePathname() ?? "/admin"
   const prefersReduced = useReducedMotion()

   return (
      <div dir="rtl" lang="fa" className="min-h-full bg-navy-100 font-vazirmatn dark:bg-navy-950">
         {/* Mobile drawer */}
         <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
            <DialogBackdrop
               transition
               className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />
            <div className="fixed inset-0 flex">
               <DialogPanel
                  transition
                  dir="rtl"
                  lang="fa"
                  className="relative me-16 flex w-full max-w-80 flex-1 transition duration-300 ease-in-out data-closed:-translate-x-full rtl:data-closed:translate-x-full"
               >
                  <div className="absolute top-0 inset-end-0 flex w-16 justify-center pt-5">
                     <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="-m-2.5 rounded-xl p-2.5 text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-brand-300"
                     >
                        <span className="sr-only">{fa.admin.header.closeSidebar}</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                     </button>
                  </div>
                  <motion.div
                     initial={prefersReduced ? false : { opacity: 0, x: 24 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                     className="flex w-full"
                  >
                     <AdminSidebarContent currentPath={pathname} onNavigate={() => setSidebarOpen(false)} />
                  </motion.div>
               </DialogPanel>
            </div>
         </Dialog>

         {/* Desktop sidebar */}
         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <AdminSidebarContent currentPath={pathname} />
         </div>

         <div className="lg:ps-72">
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
            <main className="px-4 py-8 sm:px-6 lg:px-8">
               <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
         </div>
      </div>
   )
}