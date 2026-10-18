"use client"

import Image from "next/image"
import { PencilSquareIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import type { AdminProduct } from "@/app/contracts/products"
import { rarityTone } from "@/app/contracts/products"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"

const thClass =
   "px-6 py-3.5 text-start text-xs font-bold tracking-wide text-navy-600 uppercase dark:text-navy-300"

/** How much of the stock is still left, using the same arithmetic the shop sells by. */
function stockOf(product: AdminProduct): { remaining: number; total: number } {
   const total = Number(product.count ?? 1) > 0 ? Number(product.count) : 1
   const sold = Number(product.sold_count ?? 0)
   return { remaining: Math.max(0, total - Math.max(0, sold)), total }
}

function stockClasses(remaining: number, total: number): string {
   if (remaining === 0) return "bg-red-500/10 text-red-700 dark:text-red-300"
   if (total > 0 && remaining <= Math.max(1, Math.ceil(total * 0.2))) {
      return "bg-accent-500/15 text-accent-800 dark:text-accent-300"
   }
   return "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200"
}

interface ProductsTableProps {
   products: AdminProduct[]
   onEdit: (product: AdminProduct) => void
   onDelete: (id: number) => void
   // Callbacks decide whether the current user can edit/delete each row.
   canEdit?: (product: AdminProduct) => boolean
   canDelete?: (product: AdminProduct) => boolean
}

export default function ProductsTable({ products, onEdit, onDelete, canEdit, canDelete }: ProductsTableProps) {
   const prefersReduced = useReducedMotion()

   return (
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle">
               <thead className="bg-navy-100/70 dark:bg-navy-900/50">
                  <tr className="border-b border-border-subtle">
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.productNumber}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.title}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.price}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.stock}
                     </th>
                     <th scope="col" className={thClass + " hidden lg:table-cell"}>
                        {fa.admin.products.headers.specs}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.category}
                     </th>
                     <th scope="col" className={thClass}>
                        <span className="sr-only">{fa.admin.products.headers.edit}</span>
                     </th>
                     <th scope="col" className={thClass}>
                        <span className="sr-only">{fa.admin.products.headers.delete}</span>
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/70">
                  {products.map((product, index) => {
                     const { remaining, total } = stockOf(product)
                     const rarityToneStyle = product.rarity ? rarityTone(product.rarity) : null

                     return (
                        <motion.tr
                           key={product.id}
                           initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, margin: "-40px" }}
                           transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
                           className="group transition-colors duration-200 hover:bg-brand-50/60 dark:hover:bg-brand-500/[0.07]"
                        >
                           <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-navy-950 dark:text-white">
                              <span dir="ltr" className="font-mono text-xs text-navy-500 dark:text-navy-400">
                                 {product.productNumber}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-navy-700 dark:text-navy-200">
                              <div className="flex items-center gap-3">
                                 {/* Thumbnail instead of a raw URL cell: the artwork is
                                     what an admin verifies at a glance. */}
                                 <span className="relative hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-muted sm:flex">
                                    {product.image ? (
                                       <Image
                                          src={product.image}
                                          alt=""
                                          fill
                                          sizes="40px"
                                          className="p-1 object-contain"
                                          unoptimized
                                       />
                                    ) : (
                                       <PhotoIcon className="h-4 w-4 text-navy-300 dark:text-navy-600" aria-hidden="true" />
                                    )}
                                 </span>
                                 <span className="min-w-0">
                                    <span className="block truncate font-semibold text-navy-950 dark:text-white">{product.title}</span>
                                    <span className="mt-0.5 hidden max-w-xs truncate text-xs text-navy-500 md:block dark:text-navy-400">
                                       {product.desc || "—"}
                                    </span>
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap text-navy-700 dark:text-navy-200" dir="ltr">
                              {Number.isFinite(Number(product.price)) ? formatToman(Number(product.price)) : "—"}
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span
                                 title={
                                    product.sold_count
                                       ? fa.admin.dialog.soldHint.replace("{count}", String(product.sold_count))
                                       : undefined
                                 }
                                 className={`rounded-full px-2.5 py-1 text-xs font-bold ${stockClasses(remaining, total)}`}
                                 dir="ltr"
                              >
                                 {remaining.toLocaleString("en-US")} / {total.toLocaleString("en-US")}
                              </span>
                           </td>
                           <td className="hidden px-6 py-4 text-sm lg:table-cell">
                              <div className="flex flex-col gap-1.5">
                                 {rarityToneStyle ? (
                                    <span
                                       className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold"
                                       style={rarityToneStyle}
                                    >
                                       {product.rarity}
                                    </span>
                                 ) : (
                                    <span className="text-xs text-navy-400 dark:text-navy-500">—</span>
                                 )}
                                 {product.exterior ? (
                                    <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">{product.exterior}</span>
                                 ) : null}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="rounded-full bg-navy-100 px-2.5 py-1 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                                 {product.category?.value ?? "—"}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              {canEdit?.(product) ? (
                                 <button
                                    type="button"
                                    onClick={() => onEdit(product)}
                                    aria-label={fa.admin.products.editAria.replace("{title}", product.title)}
                                    className="inline-flex items-center rounded-lg p-2 text-navy-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500/12 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:hover:bg-brand-400/15 dark:hover:text-brand-300"
                                 >
                                    <PencilSquareIcon aria-hidden="true" className="h-5 w-5" />
                                 </button>
                              ) : null}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              {canDelete?.(product) ? (
                                 <button
                                    type="button"
                                    onClick={() => onDelete(product.id)}
                                    aria-label={fa.admin.products.deleteAria.replace("{title}", product.title)}
                                    className="inline-flex items-center rounded-lg p-2 text-navy-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/12 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:bg-red-400/15 dark:hover:text-red-400"
                                 >
                                    <TrashIcon aria-hidden="true" className="h-5 w-5" />
                                 </button>
                              ) : null}
                           </td>
                        </motion.tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>
   )
}
