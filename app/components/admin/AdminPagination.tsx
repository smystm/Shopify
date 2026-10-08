"use client"

import { useState } from "react"
import ReactPaginate from "react-paginate"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface AdminPaginationProps {
    page: number
    totalPages: number
    total: number
    pageSize: number
    onPageChange?: (page: number) => void
}

function classNames(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ")
}

export default function AdminPagination({
    page,
    totalPages,
    total,
    pageSize,
    onPageChange,
}: AdminPaginationProps) {
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

   return (
      <nav
         aria-label="Pagination"
         className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-950"
      >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
             Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{start}–{end}</span> of{" "}
             <span className="font-semibold text-zinc-700 dark:text-zinc-200">{total}</span> items
          </p>
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
             <label htmlFor="jump-to-page" className="text-sm text-zinc-500 dark:text-zinc-400">
                Go to page
             </label>
             <input
                id="jump-to-page"
                type="number"
                min={1}
                max={safeTotalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                className="w-16 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-950 shadow-xs outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
             />
             <button
                type="submit"
                className="rounded-md bg-zinc-950 px-3 py-1 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
             >
                Go
             </button>
          </form>
          <ReactPaginate
            forcePage={safePage - 1}
            onPageChange={(selected) => onPageChange?.(selected.selected + 1)}
            pageCount={safeTotalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel={
               <span
                  className={classNames(
                     "inline-flex items-center rounded-md p-2 text-sm font-semibold",
                     safePage <= 1
                        ? "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
               >
                  <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
               </span>
            }
            nextLabel={
               <span
                  className={classNames(
                     "inline-flex items-center rounded-md p-2 text-sm font-semibold",
                     safePage >= safeTotalPages
                        ? "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
               >
                  <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
               </span>
            }
            pageLabelBuilder={(page) => (
               <span
                  className={classNames(
                     "min-w-9 rounded-md px-2.5 py-1.5 text-sm font-semibold",
                     page === safePage
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
               >
                  {page}
               </span>
            )}
            containerClassName="flex items-center gap-1"
            activeClassName=""
            disabledClassName=""
            breakClassName="px-1 text-zinc-400 dark:text-zinc-600"
         />
      </nav>
   )
}
