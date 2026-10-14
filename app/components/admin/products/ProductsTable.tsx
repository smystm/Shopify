import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"
import { fa } from "@/app/lib/i18n/fa"

const thClass =
   "px-6 py-3.5 text-start text-xs font-bold tracking-wide text-navy-600 uppercase dark:text-navy-300"

interface ProductsTableProps {
   products: AdminProduct[]
   onEdit: (product: AdminProduct) => void
   onDelete: (id: number) => void
   // Callbacks decide whether the current user can edit/delete each row.
   canEdit?: (product: AdminProduct) => boolean
   canDelete?: (product: AdminProduct) => boolean
}

export default function ProductsTable({ products, onEdit, onDelete, canEdit, canDelete }: ProductsTableProps) {
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
                        {fa.admin.products.headers.description}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.category}
                     </th>
                     <th scope="col" className={thClass}>
                        {fa.admin.products.headers.image}
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
                  {products.map((product) => (
                     <tr
                        key={product.id}
                        className="group transition-colors duration-200 hover:bg-brand-50/60 dark:hover:bg-brand-500/[0.07]"
                     >
                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-navy-950 dark:text-white">
                           {product.productNumber}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-navy-700 dark:text-navy-200">
                           {product.title}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-sm text-navy-600 dark:text-navy-300">
                           <span className="line-clamp-2">{product.desc}</span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                           <span className="rounded-full bg-navy-100 px-2.5 py-1 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                              {product.category?.value ?? "—"}
                           </span>
                        </td>
                        <td className="max-w-48 px-6 py-4 text-sm text-navy-600 dark:text-navy-300">
                           {product.image ? (
                              <span className="block truncate" title={product.image}>
                                 {product.image}
                              </span>
                           ) : (
                              "—"
                           )}
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
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}