"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { AdminProduct, Category } from "@/app/contracts/products"
import { getCategories } from "@/app/helpers/productApi"

export interface ProductFormValues {
    productNumber: string
    title: string
    desc: string
    category: Category
    price: string
    image: string
}

interface ProductDialogProps {
   open: boolean
   initial: AdminProduct | null
   suggestedNumber: string
   onClose: () => void
   onSave: (values: ProductFormValues) => void
   isFullPage?: boolean
   saving?: boolean
   saveError?: string | null
}

export default function ProductDialog({ open, initial, suggestedNumber, onClose, onSave, isFullPage = false, saving = false, saveError }: ProductDialogProps) {
   // When rendered as a full page (direct URL visit), skip the Dialog wrapper
   if (isFullPage) {
      return <ProductForm initial={initial} suggestedNumber={suggestedNumber} onClose={onClose} onSave={onSave} isFullPage={true} saving={saving} saveError={saveError} />
   }

   return (
      <Dialog open={open} onClose={onClose} className="relative z-50">
         <DialogBackdrop
            transition
            className="fixed inset-0 bg-zinc-950/60 transition-opacity duration-200 data-closed:opacity-0"
         />
         <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
               <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-zinc-200 transition data-closed:scale-95 data-closed:opacity-0 dark:bg-zinc-950 dark:ring-zinc-800"
               >
                  {open ? (
                     <ProductForm
                        key={initial ? `edit-${initial.id}` : `add-${suggestedNumber}`}
                        initial={initial}
                        suggestedNumber={suggestedNumber}
                        onClose={onClose}
                        onSave={onSave}
                        saving={saving}
                        saveError={saveError}
                     />
                  ) : null}
               </DialogPanel>
            </div>
         </div>
      </Dialog>
   )
}

interface ProductFormProps {
   initial: AdminProduct | null
   suggestedNumber: string
   onClose: () => void
   onSave: (values: ProductFormValues) => void
   isFullPage?: boolean
   saving?: boolean
   saveError?: string | null
}

function ProductForm({
    initial,
    suggestedNumber,
    onClose,
    onSave,
    isFullPage = false,
    saving = false,
    saveError,
}: ProductFormProps) {
    const [productNumber, setProductNumber] = useState(initial?.productNumber ?? suggestedNumber)
    const [title, setTitle] = useState(initial?.title ?? "")
    const [desc, setDesc] = useState(initial?.desc ?? "")
    const [categoryValue, setCategoryValue] = useState(initial?.category?.value ?? "")
    const [price, setPrice] = useState(initial?.price ?? "")
    const [image, setImage] = useState(initial?.image ?? "")
    const [categories, setCategories] = useState<Category[]>([])
    const [error, setError] = useState<string | null>(null)

    const isEditing = initial !== null

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
       if (!title.trim()) {
          setError("Title is required.")
          return
       }
        const selectedCategory = categories.find((c) => c.value === categoryValue)
        const category: Category = {
           id: selectedCategory?.id ?? 0,
           value: categoryValue,
        }
        await onSave({
           productNumber: productNumber.trim() || suggestedNumber,
           title: title.trim(),
           desc: desc.trim(),
           category,
           price: price.trim(),
           image: image.trim(),
        })
    }

return (
       <>
          <div className="flex items-start justify-between gap-4">
             <div>
                {isFullPage ? (
                   <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
                      {isEditing ? "Edit product" : "Add product"}
                   </h1>
                ) : (
                   <DialogTitle className="text-base font-semibold text-zinc-950 dark:text-white">
                      {isEditing ? "Edit product" : "Add product"}
                   </DialogTitle>
                )}
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                   {isEditing
                      ? "Update the product details below."
                      : "Products are kept in memory only for now — nothing is sent to the backend."}
                </p>
             </div>
            <button
               type="button"
               onClick={onClose}
               aria-label="Close dialog"
               className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
               <XMarkIcon aria-hidden="true" className="h-5 w-5" />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
               <label
                  htmlFor="product-number"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200"
               >
                  Product Number
               </label>
               <input
                  id="product-number"
                  type="text"
                  value={productNumber}
                  onChange={(e) => setProductNumber(e.target.value)}
                  placeholder={suggestedNumber}
                  className="mt-1.5 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
               />
            </div>
             <div>
                <label htmlFor="product-title" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                   Title
                </label>
                <input
                   id="product-title"
                   type="text"
                   autoFocus
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="e.g. Classic White T-Shirt"
                   className="mt-1.5 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                />
                {error ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
                {saveError ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{saveError}</p> : null}
             </div>

             <div>
                <label htmlFor="product-desc" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                   Description
                </label>
                <textarea
                   id="product-desc"
                   value={desc}
                   onChange={(e) => setDesc(e.target.value)}
                   placeholder="Describe the product..."
                   rows={3}
                   maxLength={200}
                   className="mt-1.5 block w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                />
                <p className="mt-1 text-xs text-zinc-400">{desc.length}/200</p>
             </div>

             <div>
                <label htmlFor="product-category" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                   Category
                </label>
                <select
                   id="product-category"
                   value={categoryValue}
                   onChange={(e) => setCategoryValue(e.target.value)}
                   className="mt-1.5 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                >
                   <option value="" disabled>
                      Select a category
                   </option>
                    {categories.map((cat) => (
                       <option key={cat.value} value={cat.value}>
                          {cat.value}
                       </option>
                    ))}
                </select>
             </div>

             <div>
                 <label htmlFor="product-price" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    Price
                 </label>
                 <input
                    id="product-price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 29.99"
                    className="mt-1.5 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                 />
              </div>

              <div>
                 <label htmlFor="product-image" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    Image URL
                 </label>
                 <input
                    id="product-image"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1.5 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-xs outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                 />
              </div>

             <div className="flex justify-end gap-2 pt-1">
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
               >
                  {saving ? "Saving..." : isEditing ? "Save changes" : "Add product"}
               </button>
            </div>
         </form>
      </>
   )
}
