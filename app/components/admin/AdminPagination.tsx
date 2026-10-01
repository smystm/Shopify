"use client"

import ReactPaginate from "react-paginate"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface AdminPaginationProps {
   page: number
   totalPages: number
   total: number
   pageSize: number
   onPageChange: (page: number) => void
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

   return (
      <nav
         aria-label="Pagination"
         className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-950"
      >
         <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{start}–{end}</span> of{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">{total}</span> items
         </p>
         <ReactPaginate
            forcePage={safePage - 1}
            onPageChange={(selected) => onPageChange(selected.selected + 1)}
            pageCount= {safeTotalPages}
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
