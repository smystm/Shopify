"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import type { Category } from "@/app/contracts/products"

interface ProductFilterLabels {
   title: string
   clearAll: string
   category: string
   selectAll: string
   allCategories: string
   minPrice: string
   maxPrice: string
   minPricePlaceholder: string
   maxPricePlaceholder: string
}

const defaultLabels: ProductFilterLabels = {
   title: "Filter products",
   clearAll: "Clear all",
   category: "Category",
   selectAll: "Select all",
   allCategories: "All",
   minPrice: "Min price",
   maxPrice: "Max price",
   minPricePlaceholder: "e.g. 100",
   maxPricePlaceholder: "e.g. 5000",
}

export interface ProductFilterChange {
   selectedCategory: string
   selectedSubcategories: string[]
   minPrice: string
   maxPrice: string
}

interface ProductFilterProps {
   categories: Category[]
   selectedCategory: string
   selectedSubcategories: string[]
   minPrice: string
   maxPrice: string
   labels?: Partial<ProductFilterLabels>
   mode?: "all" | "categories" | "prices"
   onChange: (next: ProductFilterChange) => void
}

const CATEGORY_ORDER = ["knife", "gloves", "pistol", "rifle", "sniper", "smg", "shotgun", "machinegun", "agent", "case", "music_kit", "other"]

const CATEGORY_ICONS: Record<string, string> = {
   all: "/icons/cs2/inventory.svg",
   knife: "/icons/cs2/knife_karambit.svg",
   gloves: "/icons/cs2/clothing_hands.svg",
   pistol: "/icons/cs2/deagle.svg",
   rifle: "/icons/cs2/ak47.svg",
   sniper: "/icons/cs2/awp.svg",
   smg: "/icons/cs2/mp9.svg",
   shotgun: "/icons/cs2/nova.svg",
   machinegun: "/icons/cs2/negev.svg",
   agent: "/icons/cs2/customplayer.svg",
   case: "/icons/cs2/inventory.svg",
   music_kit: "/icons/cs2/music_kit.svg",
   other: "/icons/cs2/taser.svg",
}

const SPECIAL_NAMES: Record<string, string> = {
   ak47: "AK-47",
   aug: "AUG",
   awp: "AWP",
   cz75_auto: "CZ75 Auto",
   deagle: "Desert Eagle",
   fbi: "FBI",
   fbi_swat: "FBI SWAT",
   g3sg1: "G3SG1",
   glock_18: "Glock-18",
   m4a1_s: "M4A1-S",
   m4a4: "M4A4",
   m9_bayonet: "M9 Bayonet",
   mp5_sd: "MP5-SD",
   pp_bizon: "PP-Bizon",
   r8_revolver: "R8 Revolver",
   scar20: "SCAR-20",
   sg553: "SG 553",
   ssg08: "SSG 08",
   usp_s: "USP-S",
   xm1014: "XM1014",
}

function displayName(value: string): string {
   if (SPECIAL_NAMES[value]) return SPECIAL_NAMES[value]

   return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function categoryIcon(categoryValue: string, className = "h-5 w-7"): React.ReactNode {
   const icon = CATEGORY_ICONS[categoryValue] ?? CATEGORY_ICONS.other

   return (
      <span
         aria-hidden="true"
         className={`inline-block shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className}`}
         style={{ maskImage: `url("${icon}")`, WebkitMaskImage: `url("${icon}")` }}
      />
   )
}

function subcategoryImage(category: Category, subcategory: string): string {
   return `/images/weapons-real/skins/${encodeURIComponent(category.value)}/${encodeURIComponent(subcategory)}/product.png`
}

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

export default function ProductFilter({ categories, selectedCategory, selectedSubcategories, minPrice, maxPrice, labels, mode = "all", onChange }: ProductFilterProps) {
   const t: ProductFilterLabels = { ...defaultLabels, ...labels }
   const [openCategory, setOpenCategory] = useState<string | null>(null)
   const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null)
   const categoryBarRef = useRef<HTMLDivElement>(null)
   const menuRef = useRef<HTMLDivElement>(null)
   const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
   const orderedCategories = [...categories].sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a.value)
      const bIndex = CATEGORY_ORDER.indexOf(b.value)
      const aRank = aIndex === -1 ? CATEGORY_ORDER.length : aIndex
      const bRank = bIndex === -1 ? CATEGORY_ORDER.length : bIndex
      return aRank - bRank || a.value.localeCompare(b.value)
   })

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

   const change = (next: Partial<ProductFilterChange>) => {
      onChange({
         selectedCategory,
         selectedSubcategories,
         minPrice,
         maxPrice,
         ...next,
      })
   }

   const openCategoryMenu = (categoryValue: string) => {
      setOpenCategory(categoryValue)
      positionMenu(categoryValue)
   }

   const toggleCategoryMenu = (categoryValue: string) => {
      if (openCategory === categoryValue) {
         setOpenCategory(null)
         setMenuPosition(null)
         return
      }
      openCategoryMenu(categoryValue)
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
   const showCategories = mode !== "prices"
   const showPrices = mode !== "categories"

   return (
      <>
         {showCategories && (
            <section
               ref={categoryBarRef}
               dir="rtl"
               className="relative z-20 mb-4 rounded-2xl border border-navy-200 bg-surface p-1.5 shadow-sm shadow-navy-900/5 dark:border-navy-800 dark:bg-navy-950"
            >
               <div className="scrollbar-polished scrollbar-category flex items-center gap-1 overflow-x-auto overscroll-x-contain">
                  <button
                     type="button"
                     aria-pressed={selectedCategory === ""}
                     onClick={() => {
                        setOpenCategory(null)
                        change({ selectedCategory: "", selectedSubcategories: [] })
                     }}
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
                              aria-controls={isOpen ? "subcategory-menu" : undefined}
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
                                 onClick={() => {
                                    setOpenCategory(null)
                                    change({ selectedCategory: "", selectedSubcategories: [] })
                                 }}
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
         )}

         {showCategories &&
            activeCategory &&
            menuPosition &&
            typeof document !== "undefined" &&
            createPortal(
               <div
                  id="subcategory-menu"
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
                        <input
                           type="checkbox"
                           checked={selectedCategory === activeCategory.value && selectedSubcategories.length === 0}
                           onChange={() => toggleSelectAll(activeCategory)}
                           className="peer sr-only"
                        />
                        {checkedIndicator(selectedCategory === activeCategory.value && selectedSubcategories.length === 0)}
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

         {showPrices && (
            <section dir="rtl" className="rounded-2xl border border-navy-200 bg-white p-5 shadow-sm shadow-navy-900/5 dark:border-navy-800 dark:bg-navy-950">
               <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-base font-semibold tracking-tight text-navy-900 dark:text-navy-50">{t.title}</h2>
               </div>

               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                     <label htmlFor="min-price" className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                        {t.minPrice}
                     </label>
                     <input
                        id="min-price"
                        type="text"
                        placeholder={t.minPricePlaceholder}
                        value={minPrice}
                        onChange={(e) => change({ minPrice: e.target.value })}
                        className="w-full rounded-xl border border-navy-300 bg-surface px-3 py-2.5 text-sm text-navy-900 shadow-xs outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"
                     />
                  </div>

                  <div>
                     <label htmlFor="max-price" className="mb-1 block text-sm font-medium text-navy-800 dark:text-navy-100">
                        {t.maxPrice}
                     </label>
                     <input
                        id="max-price"
                        type="text"
                        placeholder={t.maxPricePlaceholder}
                        value={maxPrice}
                        onChange={(e) => change({ maxPrice: e.target.value })}
                        className="w-full rounded-xl border border-navy-300 bg-surface px-3 py-2.5 text-sm text-navy-900 shadow-xs outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"
                     />
                  </div>
               </div>
               <div className="mt-5 flex justify-end">
                  <button
                     type="button"
                     onClick={() => {
                        setOpenCategory(null)
                        onChange({ selectedCategory: "", selectedSubcategories: [], minPrice: "", maxPrice: "" })
                     }}
                     className="w-full inline-flex items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-100 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-700/60 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/20"
                  >
                     {t.clearAll}
                  </button>
               </div>
            </section>
         )}
      </>
   )
}
