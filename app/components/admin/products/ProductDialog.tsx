"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronDownIcon, CpuChipIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import type { AdminProduct, Category, Exterior } from "@/app/contracts/products"
import { EXTERIOR_FLOATS, RARITY_TONE, WEAR_CATEGORIES } from "@/app/contracts/products"
import { getCategories } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

/** Shared form-control styling — one source of truth for every field below. */
const fieldClass =
   "mt-1.5 block w-full rounded-xl border border-navy-300 bg-surface px-3.5 py-2.5 text-sm text-navy-950 shadow-xs outline-none transition placeholder:text-navy-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder:text-navy-400"

/** Same control without the top margin, for fields that sit side by side. */
const inlineFieldClass = fieldClass.replace("mt-1.5 block", "block")

const labelClass = "block text-sm font-semibold text-navy-800 dark:text-navy-100"

/** The CS2 rarity tiers, in the order the market lists them. */
const RARITY_TIERS = Object.keys(RARITY_TONE) as Array<keyof typeof RARITY_TONE>

/**
 * What the create/edit form pays out, including the optional CS2 specification
 * columns. Specs leave already converted to the column shapes the API accepts
 * (`number | null` and friends) — the *form* holds strings so each box can be
 * cleared and retyped, and the conversion happens once, in this file, at save
 * time. A null means "does not apply / clear the column"; the backend never
 * reads a null as a zero default.
 */
export interface ProductFormValues {
    productNumber: string
    title: string
    desc: string
    category: Category
    price: string
    image: string
    /**
     * How many copies exist. Optional on the way in so an older caller keeps
     * compiling; the backend treats a missing figure as one rather than as
     * unlimited, which is the safe direction to fail.
     */
    count?: number | null
    /** The CS2 specification columns, in their API shape. */
    specs: ProductSpecsPayloadValues
}

/** The spec payload as it crosses to the API — column shapes, not form shapes. */
export interface ProductSpecsPayloadValues {
    exterior: string | null
    float_min: number | null
    float_max: number | null
    stattrak: number
    souvenir: number
    rarity: string | null
    collection: string | null
    /** Millisecond timestamp, or null when unset. */
    release_at: number | null
    pattern_index: number | null
}

/** Text-shape state the form holds for each spec field while being edited. */
interface ProductSpecsFormState {
    exterior: string
    float_min: string
    float_max: string
    stattrak: boolean
    souvenir: boolean
    rarity: string
    collection: string
    /** ISO date string from the date input; empty means unset. */
    release_at: string
    pattern_index: string
}

function specsFormStateFrom(product: AdminProduct | null): ProductSpecsFormState {
    return {
        exterior: product?.exterior ?? "",
        float_min: product?.float_min != null ? String(product.float_min) : "",
        float_max: product?.float_max != null ? String(product.float_max) : "",
        stattrak: product?.stattrak === 1,
        souvenir: product?.souvenir === 1,
        rarity: product?.rarity ?? "",
        collection: product?.collection ?? "",
        // A date input reads its value as yyyy-mm-dd; the stored timestamp is
        // converted here once so the box shows what the DB holds.
        release_at: product?.release_at ? toIsoDate(Number(product.release_at)) : "",
        pattern_index: product?.pattern_index != null ? String(product.pattern_index) : "",
    }
}

/** Timestamp -> yyyy-mm-dd for `<input type="date">` in UTC. */
function toIsoDate(ms: number): string {
    return new Date(ms).toISOString().slice(0, 10)
}

/** yyyy-mm-dd -> ms timestamp, or null when the field was cleared. */
function isoDateToMs(value: string): number | null {
    if (!value) return null
    // Date-only parsing is treated as UTC midnight, which is what the seed
    // scripts write - and a game release date carries no meaningful hour.
    const ms = Date.parse(`${value}T00:00:00Z`)
    return Number.isNaN(ms) ? null : ms
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
                  className="w-full max-w-lg rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl shadow-navy-900/20 transition data-closed:scale-95 data-closed:opacity-0 dark:shadow-black/40"
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
    const prefersReduced = useReducedMotion()
    const [productNumber, setProductNumber] = useState(initial?.productNumber ?? suggestedNumber)
    const [title, setTitle] = useState(initial?.title ?? "")
    const [desc, setDesc] = useState(initial?.desc ?? "")
    const [categoryValue, setCategoryValue] = useState(initial?.category?.value ?? "")
    const [price, setPrice] = useState(initial?.price ?? "")
    const [image, setImage] = useState(initial?.image ?? "")
    // Stock. Seeded from the listing when editing, and from 1 when adding - a new
    // listing with an empty stock field must not become unlimited the moment
    // somebody saves it. Kept as a string so the box can be cleared and retyped.
    const [count, setCount] = useState(String(initial?.count ?? 1))
    // The CS2 specification columns. Strings so each box can be cleared and
    // retyped; empty resolves to null ("not applicable") on submit.
    const [specs, setSpecs] = useState<ProductSpecsFormState>(() => specsFormStateFrom(initial))
    const [specsOpen, setSpecsOpen] = useState(() => initial !== null && initialHasSpecs(initial))
    const [categories, setCategories] = useState<Category[]>([])
    const [error, setError] = useState<string | null>(null)

    const isEditing = initial !== null
    /** Wear categories carry an exterior; the other categories never will. */
    const isWearCategory = WEAR_CATEGORIES.includes(categoryValue)

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]))
    }, [])

    const setSpec = <K extends keyof ProductSpecsFormState>(key: K, value: ProductSpecsFormState[K]) =>
        setSpecs((prev) => ({ ...prev, [key]: value }))

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

        // Empty equals "does not apply" rather than zero: a case has no float
        // and writing 0.0 would be a lie the product page would render.
        const floatMin = parseSpecNumber(specs.float_min)
        const floatMax = parseSpecNumber(specs.float_max)
        const pattern = parseSpecNumber(specs.pattern_index)

        await onSave({
           productNumber: productNumber.trim() || suggestedNumber,
           title: title.trim(),
           desc: desc.trim(),
           category,
           price: price.trim(),
           image: image.trim(),
            // Normalised here so an empty or nonsensical field lands as 1 rather
            // than as NULL, which the backend would read as one anyway.
            count: Math.max(1, Number.parseInt(String(count), 10) || 1),
           specs: {
              exterior: isWearCategory && specs.exterior ? specs.exterior : null,
              float_min: isWearCategory ? floatMin : null,
              float_max: isWearCategory ? floatMax : null,
              pattern_index: isWearCategory ? pattern : null,
              stattrak: specs.stattrak ? 1 : 0,
              souvenir: specs.souvenir ? 1 : 0,
              rarity: specs.rarity || null,
              collection: specs.collection.trim() ? specs.collection.trim() : null,
              release_at: isoDateToMs(specs.release_at),
           },
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
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                   <label htmlFor="product-price" className={labelClass}>
                      {fa.admin.dialog.labels.price}
                   </label>
                   <input
                      id="product-price"
                      type="text"
                      dir="ltr"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={fa.admin.dialog.placeholders.price}
                      className={fieldClass}
                   />
                </div>
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

             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Stock. Present because without it `count` is written once by
                    scripts/assign-stock.js and can never be adjusted again - a shop
                    that sold out has no way to restock from the panel. */}
                <div>
                   <label htmlFor="product-count" className={labelClass}>
                      {fa.admin.dialog.count}
                   </label>
                   <input
                      id="product-count"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={9999}
                      dir="ltr"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      className={fieldClass}
                   />
                   <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                      {initial && typeof initial.sold_count === "number" && initial.sold_count > 0
                         ? fa.admin.dialog.soldHint.replace("{count}", String(initial.sold_count))
                         : fa.admin.dialog.countHint}
                   </p>
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
             </div>

             <div>
                <label htmlFor="product-image" className={labelClass}>
                   {fa.admin.dialog.labels.imageUrl}
                </label>
                <input
                   id="product-image"
                   type="text"
                   dir="ltr"
                   value={image}
                   onChange={(e) => setImage(e.target.value)}
                   placeholder={fa.admin.dialog.placeholders.imageUrl}
                   className={fieldClass}
                />
                <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{fa.admin.dialog.imageHint}</p>
             </div>

             <SpecsSection
                specs={specs}
                setSpec={setSpec}
                open={specsOpen}
                onToggle={() => setSpecsOpen((prev) => !prev)}
                isWearCategory={isWearCategory}
                prefersReduced={prefersReduced}
             />

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

/** "0.07" -> 0.07; "" or nonsense -> null ("does not apply"). */
function parseSpecNumber(value: string): number | null {
    if (value.trim() === "") return null
    const num = Number(value)
    return Number.isFinite(num) ? num : null
}

function initialHasSpecs(product: AdminProduct): boolean {
    return (
        (product.exterior !== undefined && product.exterior !== null) ||
        (product.rarity !== undefined && product.rarity !== null) ||
        (product.collection !== undefined && product.collection !== null) ||
        (product.release_at !== undefined && product.release_at !== null) ||
        (product.pattern_index !== undefined && product.pattern_index !== null) ||
        product.stattrak === 1 ||
        product.souvenir === 1
    )
}

interface SpecsSectionProps {
    specs: ProductSpecsFormState
    setSpec: <K extends keyof ProductSpecsFormState>(key: K, value: ProductSpecsFormState[K]) => void
    open: boolean
    onToggle: () => void
    isWearCategory: boolean
    prefersReduced: boolean | null
}

/**
 * The CS2 specification block, collapsed by default the way a shop's most
 * common edits (price, stock) must sit above the deep detail. The wear-driven
 * fields appear only for wear categories, mirroring how the database treats
 * nullability as the category-awareness: a case gets no float box at all.
 */
function SpecsSection({ specs, setSpec, open, onToggle, isWearCategory, prefersReduced }: SpecsSectionProps) {
    const copy = fa.admin.dialog.specs

    return (
        <div className="rounded-2xl border border-border-subtle bg-surface-muted/60">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-start transition-colors hover:bg-brand-50/50 dark:hover:bg-brand-500/[0.06]"
            >
                <span className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white">
                    <CpuChipIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                    {copy.title}
                </span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeInOut" }}
                    className="rounded-lg p-1 text-navy-400 transition-colors group-hover:text-brand-700 dark:text-navy-500 dark:group-hover:text-brand-300"
                >
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open ? (
                    <motion.div
                        key="specs-fields"
                        initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-1 sm:grid-cols-2">
                            {isWearCategory ? (
                                <>
                                    <div>
                                        <label htmlFor="product-exterior" className={labelClass}>
                                            {copy.exterior}
                                        </label>
                                        <select
                                            id="product-exterior"
                                            value={specs.exterior}
                                            onChange={(e) => setSpec("exterior", e.target.value)}
                                            className={fieldClass}
                                        >
                                            <option value="">{copy.noValue}</option>
                                            {(Object.keys(EXTERIOR_FLOATS) as Exterior[]).map((exterior) => (
                                                <option key={exterior} value={exterior}>
                                                    {exterior}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="product-pattern" className={labelClass}>
                                            {copy.pattern} <span className="text-xs font-medium text-navy-400">0–1000</span>
                                        </label>
                                        <input
                                            id="product-pattern"
                                            type="number"
                                            dir="ltr"
                                            min={0}
                                            max={1000}
                                            value={specs.pattern_index}
                                            onChange={(e) => setSpec("pattern_index", e.target.value)}
                                            placeholder={copy.patternPlaceholder}
                                            className={fieldClass}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <span className={labelClass}>{copy.floatRange}</span>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <input
                                                type="number"
                                                dir="ltr"
                                                step="0.0001"
                                                min={0}
                                                max={1}
                                                value={specs.float_min}
                                                onChange={(e) => setSpec("float_min", e.target.value)}
                                                aria-label={copy.floatMin}
                                                placeholder={copy.floatMin}
                                                className={inlineFieldClass}
                                            />
                                            <span className="text-xs font-bold text-navy-400">–</span>
                                            <input
                                                type="number"
                                                dir="ltr"
                                                step="0.0001"
                                                min={0}
                                                max={1}
                                                value={specs.float_max}
                                                onChange={(e) => setSpec("float_max", e.target.value)}
                                                aria-label={copy.floatMax}
                                                placeholder={copy.floatMax}
                                                className={inlineFieldClass}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                                            {specs.exterior && EXTERIOR_FLOATS[specs.exterior as Exterior]
                                                ? copy.floatHint.replace("{min}", String(EXTERIOR_FLOATS[specs.exterior as Exterior].min)).replace("{max}", String(EXTERIOR_FLOATS[specs.exterior as Exterior].max))
                                                : copy.floatHintGeneric}
                                        </p>
                                    </div>
                                </>
                            ) : null}

                            <div>
                                <label htmlFor="product-rarity" className={labelClass}>
                                    {copy.rarity}
                                </label>
                                <select
                                    id="product-rarity"
                                    value={specs.rarity}
                                    onChange={(e) => setSpec("rarity", e.target.value)}
                                    className={fieldClass}
                                >
                                    <option value="">{copy.noValue}</option>
                                    {RARITY_TIERS.map((tier) => (
                                        <option key={tier} value={tier}>
                                            {tier}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="product-collection" className={labelClass}>
                                    {copy.collection}
                                </label>
                                <input
                                    id="product-collection"
                                    type="text"
                                    value={specs.collection}
                                    onChange={(e) => setSpec("collection", e.target.value)}
                                    placeholder={copy.collectionPlaceholder}
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="product-release" className={labelClass}>
                                    {copy.release}
                                </label>
                                <input
                                    id="product-release"
                                    type="date"
                                    dir="ltr"
                                    value={specs.release_at}
                                    onChange={(e) => setSpec("release_at", e.target.value)}
                                    className={fieldClass}
                                />
                            </div>

                            <FlagToggle
                                label={copy.stattrak}
                                checked={specs.stattrak}
                                onChange={(checked) => setSpec("stattrak", checked)}
                            />
                            <FlagToggle
                                label={copy.souvenir}
                                checked={specs.souvenir}
                                onChange={(checked) => setSpec("souvenir", checked)}
                            />
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

function FlagToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            role="switch"
            aria-checked={checked}
            className="flex items-start justify-between gap-3 rounded-xl border border-navy-300 bg-surface px-3.5 py-3 text-sm font-semibold text-navy-800 shadow-xs transition-colors hover:border-brand-400 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:hover:border-brand-400"
        >
            <span>{label}</span>
            {/* dir="ltr" keeps the knob's travel purely physical, so the same
                write-on/lit-on state renders identically in the RTL shell. */}
            <span
                dir="ltr"
                className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
                    checked ? "bg-brand-600" : "bg-navy-200 dark:bg-navy-700"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        checked ? "translate-x-4" : "translate-x-0"
                    }`}
                />
            </span>
        </button>
    )
}
