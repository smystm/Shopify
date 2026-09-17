import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface ProductsPaginationProps {
   page: number
   totalPages: number
   total: number
   pageSize: number
   onPageChange: (page: number) => void
}

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

export default function ProductsPagination({
   page,
   totalPages,
   total,
   pageSize,
   onPageChange,
}: ProductsPaginationProps) {
   const safeTotalPages = Math.max(1, totalPages)
   const safePage = Math.min(Math.max(1, page), safeTotalPages)
   const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1
   const end = Math.min(safePage * pageSize, total)
   const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1)

   return (
      <nav
         aria-label="Products pagination"
         className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-950"
      >
         <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{start}–{end}</span> of{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">{total}</span> products
         </p>
         <div className="flex items-center gap-1">
            <button
               type="button"
               disabled={safePage <= 1}
               onClick={() => onPageChange(safePage - 1)}
               aria-label="Previous page"
               className="inline-flex items-center rounded-md p-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
               <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            {pages.map((p) => (
               <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-label={`Go to page ${p}`}
                  aria-current={p === safePage ? "page" : undefined}
                  className={classNames(
                     "min-w-9 rounded-md px-2.5 py-1.5 text-sm font-semibold",
                     p === safePage
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  )}
               >
                  {p}
               </button>
            ))}
            <button
               type="button"
               disabled={safePage >= safeTotalPages}
               onClick={() => onPageChange(safePage + 1)}
               aria-label="Next page"
               className="inline-flex items-center rounded-md p-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
               <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
         </div>
      </nav>
   )
}
