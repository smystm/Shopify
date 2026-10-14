"use client"

import { useState } from "react"
import ReactPaginate from "react-paginate"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"

interface PaginationProps {
   page: number
   totalPages: number
   total: number
   pageSize: number
   onPageChange?: (page: number) => void
}

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

/**
 * Shared pagination for the storefront and the admin panel.
 * Extracted because the two were 99% identical, which meant any styling fix had
 * to be applied twice and they could silently drift apart.
 */
export default function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
   const safeTotalPages = Math.max(1, totalPages)
   const safePage = Math.min(Math.max(1, page), safeTotalPages)
   const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1
   const end = Math.min(safePage * pageSize, total)
   const [jumpToPage, setJumpToPage] = useState("")

   const handleJumpSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const target = parseInt(jumpToPage, 10)
      if (!isNaN(target) && target >= 1 && target <= safeTotalPages) {
         onPageChange?.(target)
      }
      setJumpToPage("")
   }

   const navButton = (disabled: boolean) =>
      classNames(
         "inline-flex items-center rounded-lg p-2 text-sm font-semibold transition-all duration-200",
         disabled ? "cursor-not-allowed text-navy-300 dark:text-navy-700" : "text-navy-600 hover:bg-brand-50 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-800",
      )

   return (
      <nav
         aria-label={fa.products.pagination.ariaLabel}
         className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-strong bg-surface px-4 py-3 shadow-md shadow-navy-900/5"
      >
         <p className="text-sm text-navy-500 dark:text-navy-400">
            {fa.products.pagination.showing
               .replace("{start}", String(start))
               .replace("{end}", String(end))
               .replace("{total}", String(total))}
         </p>

         <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
            <label htmlFor="jump-to-page" className="text-sm text-navy-500 dark:text-navy-400">
               {fa.products.pagination.goToPage}
            </label>
            <input
               id="jump-to-page"
               type="number"
               min={1}
               max={safeTotalPages}
               value={jumpToPage}
               onChange={(e) => setJumpToPage(e.target.value)}
               className="w-16 rounded-lg border border-navy-300 bg-surface px-2 py-1 text-sm text-navy-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
            />
            <button
               type="submit"
               className="rounded-lg bg-linear-to-l from-brand-700 to-brand-800 px-3.5 py-1.5 text-sm font-bold text-white shadow-md shadow-brand-700/25 transition hover:shadow-lg"
            >
               {fa.products.pagination.go}
            </button>
         </form>

         <ReactPaginate
            forcePage={safePage - 1}
            onPageChange={(selected) => onPageChange?.(selected.selected + 1)}
            pageCount={safeTotalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel={
               <span className={navButton(safePage <= 1)}>
                  <ChevronLeftIcon aria-hidden="true" className="h-5 w-5 rtl:hidden" />
                  <ChevronRightIcon aria-hidden="true" className="hidden h-5 w-5 rtl:block" />
               </span>
            }
            nextLabel={
               <span className={navButton(safePage >= safeTotalPages)}>
                  <ChevronRightIcon aria-hidden="true" className="h-5 w-5 rtl:hidden" />
                  <ChevronLeftIcon aria-hidden="true" className="hidden h-5 w-5 rtl:block" />
               </span>
            }
            pageLabelBuilder={(p) => (
               <span
                  className={classNames(
                     "min-w-9 rounded-lg px-2.5 py-1.5 text-center text-sm font-semibold transition-all duration-200",
                     p === safePage
                        ? "bg-linear-to-l from-brand-700 to-brand-800 text-white shadow-md shadow-brand-700/25"
                        : "text-navy-600 hover:bg-brand-50 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-800",
                  )}
               >
                  {p}
               </span>
            )}
            containerClassName="flex items-center gap-1"
            activeClassName=""
            disabledClassName=""
            breakClassName="px-1 text-navy-400 dark:text-navy-600"
         />
      </nav>
   )
}