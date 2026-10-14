"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import type { AdminProduct, Category } from "@/app/contracts/products"
import { getCategories } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

/** Shared form-control styling — one source of truth for every field below. */
const fieldClass =
   "mt-1.5 block w-full rounded-xl border border-navy-300 bg-surface px-3.5 py-2.5 text-sm text-navy-950 shadow-xs outline-none transition placeholder:text-navy-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder:text-navy-400"

const labelClass = "block text-sm font-semibold text-navy-800 dark:text-navy-100"

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
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0"
         />
         <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
               <DialogPanel
                  transition
                  className="w-full max-w-md rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl shadow-navy-900/20 transition data-closed:scale-95 data-closed:opacity-0 dark:shadow-black/40"
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
          setError(fa.admin.dialog.titleRequired)
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
                   <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white">
                      {isEditing ? fa.admin.dialog.editTitle : fa.admin.dialog.addTitle}
                   </h1>
                ) : (
                   <DialogTitle className="text-base font-bold text-navy-950 dark:text-white">
                      {isEditing ? fa.admin.dialog.editTitle : fa.admin.dialog.addTitle}
                   </DialogTitle>
                )}
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
                   {isEditing ? fa.admin.dialog.editSubtitle : fa.admin.dialog.addSubtitle}
                </p>
             </div>
            <button
               type="button"
               onClick={onClose}
               aria-label={fa.admin.dialog.close}
               className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:hover:bg-navy-800 dark:hover:text-brand-300"
            >
               <XMarkIcon aria-hidden="true" className="h-5 w-5" />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
               <label
                  htmlFor="product-number"
                  className={labelClass}
               >
                  {fa.admin.dialog.labels.productNumber}
               </label>
               <input
                  id="product-number"
                  type="text"
                  value={productNumber}
                  onChange={(e) => setProductNumber(e.target.value)}
                  placeholder={suggestedNumber}
                  className={fieldClass}
               />
            </div>
             <div>
                <label htmlFor="product-title" className={labelClass}>
                   {fa.admin.dialog.labels.title}
                </label>
                <input
                   id="product-title"
                   type="text"
                   autoFocus
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder={fa.admin.dialog.placeholders.title}
                   className={fieldClass}
                />
                {error ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
                {saveError ? <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{saveError}</p> : null}
             </div>

             <div>
                <label htmlFor="product-desc" className={labelClass}>
                   {fa.admin.dialog.labels.description}
                </label>
                <textarea
                   id="product-desc"
                   value={desc}
                   onChange={(e) => setDesc(e.target.value)}
                   placeholder={fa.admin.dialog.placeholders.description}
                   rows={3}
                   maxLength={200}
                   className={`${fieldClass} resize-none`}
                />
                <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{fa.admin.dialog.charCount.replace("{count}", String(desc.length))}</p>
             </div>

             <div>
                <label htmlFor="product-category" className={labelClass}>
                   {fa.admin.dialog.labels.category}
                </label>
                <select
                   id="product-category"
                   value={categoryValue}
                   onChange={(e) => setCategoryValue(e.target.value)}
                   className={fieldClass}
                >
                   <option value="" disabled>
                      {fa.admin.dialog.placeholders.category}
                   </option>
                    {categories.map((cat) => (
                       <option key={cat.value} value={cat.value}>
                          {cat.value}
                       </option>
                    ))}
                </select>
             </div>

             <div>
                 <label htmlFor="product-price" className={labelClass}>
                    {fa.admin.dialog.labels.price}
                 </label>
                 <input
                    id="product-price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={fa.admin.dialog.placeholders.price}
                    className={fieldClass}
                 />
              </div>

              <div>
                 <label htmlFor="product-image" className={labelClass}>
                    {fa.admin.dialog.labels.imageUrl}
                 </label>
                 <input
                    id="product-image"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={fa.admin.dialog.placeholders.imageUrl}
                    className={fieldClass}
                 />
              </div>

             <div className="flex justify-end gap-2 pt-1">
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-navy-300 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-navy-600 dark:text-navy-200 dark:hover:border-brand-400 dark:hover:bg-brand-500/10"
               >
                  {fa.admin.dialog.cancel}
               </button>
               <button
                  type="submit"
                  disabled={saving}
                  className="group relative overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all hover:shadow-xl hover:shadow-brand-700/40 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
               >
                  {saving ? fa.admin.dialog.saving : isEditing ? fa.admin.dialog.save : fa.admin.dialog.submitAdd}
               </button>
            </div>
         </form>
      </>
   )
}
