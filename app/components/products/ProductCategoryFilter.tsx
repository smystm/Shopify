"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import type { Category, ProductFilterState } from "@/app/contracts/products"
import { CATEGORY_ORDER, categoryIconClass, categoryIconStyle, displayName } from "@/app/lib/catalog"

export type CategorySelection = Pick<ProductFilterState, "selectedCategory" | "selectedSubcategories">

interface CategoryFilterLabels {
   allCategories: string
   selectAll: string
}

const defaultLabels: CategoryFilterLabels = {
   allCategories: "All",
   selectAll: "Select all",
}

interface ProductCategoryFilterProps {
   categories: Category[]
   selectedCategory: string
   selectedSubcategories: string[]
   labels?: Partial<CategoryFilterLabels>
   onChange: (next: CategorySelection) => void
}

function categoryIcon(categoryValue: string, className = "h-5 w-7"): React.ReactNode {
   return (
      <span aria-hidden="true" className={categoryIconClass(categoryValue, className)} style={categoryIconStyle(categoryValue)} />
   )
}

function subcategoryImage(category: Category, subcategory: string): string {
   return `/images/weapons-real/skins/${encodeURIComponent(category.value)}/${encodeURIComponent(subcategory)}/product.png`
}

/**
 * A styled stand-in for a native checkbox. The real `<input>` stays in the DOM,
 * `sr-only` and `peer`, so keyboard and screen-reader behaviour is unchanged.
 */
function checkedIndicator(checked: boolean): React.ReactNode {
   return (
      <span
         aria-hidden="true"
         className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
            checked
               ? "border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-500/30"
               : "border-navy-300 bg-white text-transparent group-hover:border-brand-400 dark:border-navy-600 dark:bg-navy-900"
         }`}
      >
         <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 10 3.1 3.1L15 6.5" />
         </svg>
      </span>
   )
}

export default function ProductCategoryFilter({ categories, selectedCategory, selectedSubcategories, labels, onChange }: ProductCategoryFilterProps) {
   const t: CategoryFilterLabels = { ...defaultLabels, ...labels }
   const menuId = useId()
   const [openCategory, setOpenCategory] = useState<string | null>(null)
   const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null)
   const categoryBarRef = useRef<HTMLDivElement>(null)
   const menuRef = useRef<HTMLDivElement>(null)
   const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

   const orderedCategories = useMemo(
      () =>
         [...categories].sort((a, b) => {
            const aIndex = CATEGORY_ORDER.indexOf(a.value)
            const bIndex = CATEGORY_ORDER.indexOf(b.value)
            const aRank = aIndex === -1 ? CATEGORY_ORDER.length : aIndex
            const bRank = bIndex === -1 ? CATEGORY_ORDER.length : bIndex
            return aRank - bRank || a.value.localeCompare(b.value)
         }),
      [categories],
   )

   const positionMenu = useCallback((categoryValue: string) => {
      const categoryElement = categoryRefs.current[categoryValue]
      if (!categoryElement) return

      const rect = categoryElement.getBoundingClientRect()
      const width = Math.min(448, window.innerWidth - 16)
      // The category strip is intentionally RTL, so the panel follows the
      // reference layout by aligning its right edge with the category item.
      const preferredLeft = rect.right - width
      const left = Math.max(8, Math.min(preferredLeft, window.innerWidth - width - 8))

      setMenuPosition({ top: rect.bottom + 8, left, width })
   }, [])

   const updateMenuPosition = useCallback(() => {
      if (!openCategory) {
         setMenuPosition(null)
         return
      }
      positionMenu(openCategory)
   }, [openCategory, positionMenu])

   useEffect(() => {
      if (!openCategory) return

      const closeOnOutsidePointer = (event: PointerEvent) => {
         const target = event.target as Node
         if (!categoryBarRef.current?.contains(target) && !menuRef.current?.contains(target)) {
            setOpenCategory(null)
         }
      }
      const closeOnEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") setOpenCategory(null)
      }
      const reposition = () => updateMenuPosition()

      document.addEventListener("pointerdown", closeOnOutsidePointer)
      document.addEventListener("keydown", closeOnEscape)
      window.addEventListener("resize", reposition)
      window.addEventListener("scroll", reposition, true)

      return () => {
         document.removeEventListener("pointerdown", closeOnOutsidePointer)
         document.removeEventListener("keydown", closeOnEscape)
         window.removeEventListener("resize", reposition)
         window.removeEventListener("scroll", reposition, true)
      }
   }, [openCategory, updateMenuPosition])

   const change = (next: Partial<CategorySelection>) => {
      onChange({ selectedCategory, selectedSubcategories, ...next })
   }

   const toggleCategoryMenu = (categoryValue: string) => {
      if (openCategory === categoryValue) {
         setOpenCategory(null)
         setMenuPosition(null)
         return
      }
      setOpenCategory(categoryValue)
      positionMenu(categoryValue)
   }

   const clearSelection = () => {
      setOpenCategory(null)
      change({ selectedCategory: "", selectedSubcategories: [] })
   }

   const toggleSelectAll = (category: Category) => {
      const categoryIsActive = selectedCategory === category.value
      const allAreSelected = categoryIsActive && selectedSubcategories.length === 0

      change({
         selectedCategory: allAreSelected ? "" : category.value,
         selectedSubcategories: [],
      })
   }

   const toggleSubcategory = (category: Category, subcategory: string) => {
      const available = category.subcategories ?? []
      const categoryIsActive = selectedCategory === category.value
      const allAreSelected = categoryIsActive && selectedSubcategories.length === 0
      const currentChecked = !categoryIsActive ? [] : allAreSelected ? available : selectedSubcategories
      const isChecked = currentChecked.includes(subcategory)
      const nextChecked = isChecked ? currentChecked.filter((value) => value !== subcategory) : [...currentChecked, subcategory]
      const normalized = nextChecked.length === available.length ? [] : nextChecked

      change({
         selectedCategory: nextChecked.length === 0 ? "" : category.value,
         selectedSubcategories: nextChecked.length === 0 ? [] : normalized,
      })
   }

   const activeCategory = orderedCategories.find((category) => category.value === openCategory) ?? null
   const selectAllChecked = activeCategory !== null && selectedCategory === activeCategory.value && selectedSubcategories.length === 0

   return (
      <>
         <section
            ref={categoryBarRef}
            dir="rtl"
            className="relative z-20 mb-4 rounded-2xl border border-navy-200 bg-surface p-1.5 shadow-sm shadow-navy-900/5 dark:border-navy-800 dark:bg-navy-950"
         >
            <div className="scrollbar-polished scrollbar-category flex items-center gap-1 overflow-x-auto overscroll-x-contain">
               <button
                  type="button"
                  aria-pressed={selectedCategory === ""}
                  onClick={clearSelection}
                  className={`group flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                     selectedCategory === ""
                        ? "bg-linear-to-l from-brand-700 to-brand-800 text-white shadow-md shadow-brand-700/25"
                        : "text-navy-500 hover:bg-brand-50 hover:text-brand-700 dark:text-navy-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                  }`}
               >
                  {categoryIcon("all", "h-4 w-4 transition-transform duration-200 group-hover:scale-105")}
                  <span dir="ltr">{t.allCategories}</span>
               </button>

               {orderedCategories.map((category) => {
                  const isOpen = openCategory === category.value
                  const isSelected = selectedCategory === category.value
                  const selectedCount = isSelected ? selectedSubcategories.length : 0

                  return (
                     <div
                        key={category.value}
                        ref={(element) => {
                           categoryRefs.current[category.value] = element
                        }}
                        className={`group flex shrink-0 items-center rounded-xl transition-colors duration-200 ${
                           isSelected || isOpen
                              ? "bg-brand-500/10 text-navy-900 dark:text-navy-100"
                              : "text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-400 dark:hover:bg-navy-900 dark:hover:text-navy-100"
                        }`}
                     >
                        <button
                           type="button"
                           aria-expanded={isOpen}
                           aria-haspopup="true"
                           aria-controls={isOpen ? menuId : undefined}
                           onClick={() => toggleCategoryMenu(category.value)}
                           className={`flex items-center gap-1.5 whitespace-nowrap py-1.5 text-xs font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                              isSelected ? "pl-2.5 pr-1" : "px-2.5"
                           }`}
                        >
                           <span className={`transition-transform duration-200 ${isOpen ? "scale-105" : "group-hover:scale-105"}`}>{categoryIcon(category.value, "h-4 w-6")}</span>
                           <span dir="ltr">{displayName(category.value)}</span>
                           {selectedCount > 0 && (
                              <span dir="ltr" className="rounded-full bg-accent-400/20 px-1.5 py-0.5 text-[10px] font-extrabold text-accent-700 dark:text-accent-300">
                                 {selectedCount}
                              </span>
                           )}
                           <svg
                              viewBox="0 0 20 20"
                              className={`h-4 w-4 shrink-0 text-current/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                           >
                              <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
                           </svg>
                        </button>

                        {isSelected && (
                           <button
                              type="button"
                              aria-label={`Clear ${displayName(category.value)} filter`}
                              onClick={clearSelection}
                              className="flex self-stretch items-center px-2 text-navy-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                           >
                              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                                 <path d="M4 4l8 8M12 4l-8 8" />
                              </svg>
                           </button>
                        )}
                     </div>
                  )
               })}
            </div>
         </section>

         {activeCategory &&
            menuPosition &&
            typeof document !== "undefined" &&
            createPortal(
               <div
                  id={menuId}
                  ref={menuRef}
                  dir="rtl"
                  role="dialog"
                  aria-label={`${displayName(activeCategory.value)} subcategories`}
                  className="fixed z-50 overflow-hidden rounded-2xl border border-navy-200 bg-white py-1 text-right shadow-2xl shadow-navy-950/20 animate-[fade-in-up_180ms_ease-out_both] dark:border-navy-700 dark:bg-navy-950"
                  style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
               >
                  <label className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-navy-800 transition-colors hover:bg-brand-50 focus-within:bg-brand-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500/30 dark:text-navy-100 dark:hover:bg-brand-500/10 dark:focus-within:bg-brand-500/10">
                     <span>{t.selectAll}</span>
                     <span className="relative">
                        <input type="checkbox" checked={selectAllChecked} onChange={() => toggleSelectAll(activeCategory)} className="peer sr-only" />
                        {checkedIndicator(selectAllChecked)}
                     </span>
                  </label>

                  <div className="mx-3 border-t border-navy-200 dark:border-navy-800" />

                  <div className="scrollbar-polished max-h-[min(24rem,50dvh)] overflow-y-auto overscroll-contain py-1">
                     {(activeCategory.subcategories ?? []).map((subcategory) => {
                        const isChecked = selectedCategory === activeCategory.value && (selectedSubcategories.length === 0 || selectedSubcategories.includes(subcategory))

                        return (
                           <label
                              key={subcategory}
                              className="group flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-navy-800 transition-all duration-200 hover:-translate-x-0.5 hover:bg-brand-50 focus-within:bg-brand-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500/30 dark:text-navy-100 dark:hover:bg-brand-500/10 dark:focus-within:bg-brand-500/10"
                           >
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-50 ring-1 ring-inset ring-navy-200 transition-all duration-200 group-hover:ring-brand-300 dark:bg-navy-900 dark:ring-navy-700 dark:group-hover:ring-brand-700">
                                 <Image
                                    src={subcategoryImage(activeCategory, subcategory)}
                                    alt=""
                                    width={40}
                                    height={40}
                                    sizes="48px"
                                    className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-110"
                                 />
                              </span>
                              <span dir="ltr" className="min-w-0 flex-1 truncate text-right font-medium">
                                 {displayName(subcategory)}
                              </span>
                              <span className="relative">
                                 <input type="checkbox" checked={isChecked} onChange={() => toggleSubcategory(activeCategory, subcategory)} className="peer sr-only" />
                                 {checkedIndicator(isChecked)}
                              </span>
                           </label>
                        )
                     })}
                  </div>
               </div>,
               document.body,
            )}
      </>
   )
}
