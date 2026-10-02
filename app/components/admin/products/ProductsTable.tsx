import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"

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
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
               <thead className="bg-zinc-50 dark:bg-zinc-900/60">
                  <tr>
                     <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                     >
                        Product Number
                     </th>
                   <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                   >
                      Title
                   </th>
                   <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                   >
                      Description
                   </th>
                   <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                   >
                      Category
                   </th>
                   <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                   >
                      Edit
                   </th>
                     <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
                     >
                        Delete
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {products.map((product) => (
                     <tr key={product.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40">
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-zinc-950 dark:text-white">
                           {product.productNumber}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                           {product.title}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                           <span className="line-clamp-2">{product.desc}</span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                           {product.category?.value ?? "—"}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            {canEdit?.(product) && (
                               <button
                                  type="button"
                                  onClick={() => onEdit(product)}
                                  aria-label={`Edit ${product.title}`}
                                  className="inline-flex items-center rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                               >
                                  <PencilSquareIcon aria-hidden="true" className="h-5 w-5" />
                               </button>
                            )}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            {canDelete?.(product) && (
                               <button
                                  type="button"
                                  onClick={() => onDelete(product.id)}
                                  aria-label={`Delete ${product.title}`}
                                  className="inline-flex items-center rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                               >
                                  <TrashIcon aria-hidden="true" className="h-5 w-5" />
                               </button>
                            )}
                         </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
