"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import type { ProductFilterState, ProductSort } from "@/app/contracts/products"

export type PanelFilterChange = Pick<ProductFilterState, "minPrice" | "maxPrice" | "search" | "sort">

const SORT_OPTIONS: { value: ProductSort; labelKey: "sortPriceAsc" | "sortPriceDesc" | "sortBestSelling" }[] = [
   { value: "price_asc", labelKey: "sortPriceAsc" },
   { value: "price_desc", labelKey: "sortPriceDesc" },
   { value: "best_selling", labelKey: "sortBestSelling" },
]

interface PanelFilterLabels {
   title: string
   clearAll: string
   minPrice: string
   maxPrice: string
   minPricePlaceholder: string
   maxPricePlaceholder: string
   search: string
   searchPlaceholder: string
   clearSearch: string
   sort: string
   sortDefault: string
   sortPriceAsc: string
   sortPriceDesc: string
   sortBestSelling: string
}

const defaultLabels: PanelFilterLabels = {
   title: "Filter products",
   clearAll: "Clear all",
   minPrice: "Min price",
   maxPrice: "Max price",
   minPricePlaceholder: "e.g. 100",
   maxPricePlaceholder: "e.g. 5000",
   search: "Search",
   searchPlaceholder: "Search products…",
   clearSearch: "Clear search",
   sort: "Sort by",
   sortDefault: "Default",
   sortPriceAsc: "Lowest Price",
   sortPriceDesc: "Highest Price",
   sortBestSelling: "Best-Selling",
}

/** How long to wait after the last keystroke before writing to the URL. */
const SEARCH_DEBOUNCE_MS = 300

interface ProductPriceFilterProps {
   minPrice: string
   maxPrice: string
   search: string
   sort: ProductSort
   labels?: Partial<PanelFilterLabels>
   onChange: (next: PanelFilterChange) => void
   /**
    * The reset button is labelled "clear all", but it also owns the category
    * selection, which this component knows nothing about. The caller decides
    * how wide the reset reaches.
    */
   onClearAll: () => void
}

const fieldClass =
   "w-full rounded-xl border border-navy-300 bg-surface px-3 py-2.5 text-sm text-navy-900 shadow-xs outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"

export default function ProductPriceFilter({ minPrice, maxPrice, search, sort, labels, onChange, onClearAll }: ProductPriceFilterProps) {
   const t: PanelFilterLabels = { ...defaultLabels, ...labels }
   const searchId = useId()
   const sortId = useId()
   const minPriceId = useId()
   const maxPriceId = useId()

   // The URL is the source of truth for every other field, but a debounced
   // input cannot read from it directly: the field would then lag a full
   // router round-trip behind each keystroke. So the text lives here and is
   // pushed to the URL on a timer instead.
   const [draft, setDraft] = useState(search)
   const committed = useRef(search)

   // Read through refs rather than closed over. A timer fires 300ms after the
   // keystroke, by which time the caller may have re-rendered with different
   // props, and those must win. Putting them in the dependency array instead
   // would restart the timer on every parent render, because the parent passes
   // a fresh `onChange` each time.
   //
   // Synced in an effect rather than during render, which `react-hooks/refs`
   // rightly forbids. Declared first so the refs are fresh before the debounce
   // effect below sets up its timer.
   const latest = useRef({ minPrice, maxPrice, search, sort })
   const emit = useRef(onChange)

   useEffect(() => {
      latest.current = { minPrice, maxPrice, search, sort }
      emit.current = onChange
   })

   // Adopt external changes (clear-all, back/forward) without fighting the
   // user mid-typing.
   useEffect(() => {
      if (search !== committed.current) {
         committed.current = search
         setDraft(search)
      }
   }, [search])

   useEffect(() => {
      if (draft === committed.current) return

      const timer = setTimeout(() => {
         committed.current = draft
         emit.current({ ...latest.current, search: draft })
      }, SEARCH_DEBOUNCE_MS)

      return () => clearTimeout(timer)
   }, [draft])

   return (
      <section dir="rtl" className="rounded-2xl border border-navy-200 bg-white p-3 py-5 shadow-sm shadow-navy-900/5 dark:border-navy-800 dark:bg-navy-950">
         <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight text-navy-900 dark:text-navy-50">{t.title}</h2>
         </div>

         <div className="flex flex-col gap-4 py-4">
            <div>
               <label htmlFor={searchId} className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                  {t.search}
               </label>
               <div className="relative">
                  <MagnifyingGlassIcon
                     aria-hidden="true"
                     className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-navy-400 dark:text-navy-500"
                  />
                  <input
                     id={searchId}
                     type="search"
                     value={draft}
                     placeholder={t.searchPlaceholder}
                     onChange={(e) => setDraft(e.target.value)}
                     // Both inline sides are reserved: the magnifier sits at the
                     // start and the clear button at the end, so under RTL the
                     // text runs from the right and would otherwise slide under
                     // whichever icon is on that side. Reserving both sides also
                     // keeps the text from jumping when the clear button appears.
                     className={`${fieldClass} pe-9 ps-9 [&::-webkit-search-cancel-button]:hidden`}
                  />
                  {draft !== "" && (
                     <button
                        type="button"
                        onClick={() => {
                           setDraft("")
                           committed.current = ""
                           onChange({ ...latest.current, search: "" })
                        }}
                        aria-label={t.clearSearch}
                        className="absolute inset-y-0 end-1.5 my-auto flex h-6 w-6 items-center justify-center rounded-lg text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600 dark:hover:bg-navy-800 dark:hover:text-navy-100"
                     >
                        <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                     </button>
                  )}
               </div>
            </div>

            <div>
               <label htmlFor={sortId} className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                  {t.sort}
               </label>
               {/* A native select keeps RTL, the mobile picker and keyboard /
                  screen-reader support correct, which a hand-rolled listbox
                  would regress. The chevron is drawn on top of it. */}
               <div className="relative">
                  <select
                     id={sortId}
                     value={sort}
                     onChange={(e) => onChange({ minPrice, maxPrice, search, sort: e.target.value as ProductSort })}
                     className={`${fieldClass} cursor-pointer appearance-none pe-9`}
                  >
                     <option value="">{t.sortDefault}</option>
                     {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                           {t[option.labelKey]}
                        </option>
                     ))}
                  </select>
                  <ChevronDownIcon
                     aria-hidden="true"
                     className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-navy-400 dark:text-navy-500"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
               <div>
                  <label htmlFor={minPriceId} className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                     {t.minPrice}
                  </label>
                  <input
                     id={minPriceId}
                     type="text"
                     placeholder={t.minPricePlaceholder}
                     value={minPrice}
                     onChange={(e) => onChange({ minPrice: e.target.value, maxPrice, search, sort })}
                     className={fieldClass}
                  />
               </div>

               <div>
                  <label htmlFor={maxPriceId} className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                     {t.maxPrice}
                  </label>
                  <input
                     id={maxPriceId}
                     type="text"
                     placeholder={t.maxPricePlaceholder}
                     value={maxPrice}
                     onChange={(e) => onChange({ minPrice, maxPrice: e.target.value, search, sort })}
                     className={fieldClass}
                  />
               </div>
            </div>
         </div>

         <div className="mt-5 flex justify-end">
            <button
               type="button"
               onClick={onClearAll}
               className="w-full inline-flex items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-100 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-700/60 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/20"
            >
               {t.clearAll}
            </button>
         </div>
      </section>
   )
}
