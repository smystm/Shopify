"use client"

import type { Category } from "@/app/contracts/products"
import SelectBox from "@/app/components/ui/SelectBox"

interface ProductFilterLabels {
    title: string;
    clearAll: string;
    category: string;
    categoryPlaceholder: string;
    allCategories: string;
    minPrice: string;
    maxPrice: string;
    minPricePlaceholder: string;
    maxPricePlaceholder: string;
}

/**
 * English defaults keep the admin products page unchanged; the storefront
 * (/products) passes localized labels from the fa dictionary instead.
 */
const defaultLabels: ProductFilterLabels = {
    title: "Filter products",
    clearAll: "Clear all",
    category: "Category",
    categoryPlaceholder: "Select category",
    allCategories: "All",
    minPrice: "Min price",
    maxPrice: "Max price",
    minPricePlaceholder: "e.g. 100",
    maxPricePlaceholder: "e.g. 5000",
};

interface ProductFilterProps {
    categories: Category[]
    selectedCategory: string
    minPrice: string
    maxPrice: string
    labels?: Partial<ProductFilterLabels>
    onChange: (next: { selectedCategory: string; minPrice: string; maxPrice: string }) => void
}

export default function ProductFilter({
    categories,
    selectedCategory,
    minPrice,
    maxPrice,
    labels,
    onChange,
}: ProductFilterProps) {
    const options = categories.map((c) => ({ value: c.value, label: c.value }))
    const t: ProductFilterLabels = { ...defaultLabels, ...labels }

    return (
        <div className="rounded-xl border border-navy-200 bg-white p-5 shadow-xs dark:border-navy-800 dark:bg-navy-950">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold tracking-tight text-navy-900 dark:text-navy-50">{t.title}</h2>
                <button
                    type="button"
                    onClick={() => onChange({ selectedCategory: "", minPrice: "", maxPrice: "" })}
                    className="text-xs font-medium text-navy-500 underline-offset-2 hover:underline dark:text-navy-400"
                >
                    {t.clearAll}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <SelectBox
                    name="category"
                    label={t.category}
                    options={options}
                    value={selectedCategory}
                    placeholder={t.categoryPlaceholder}
                    allLabel={t.allCategories}
                    onChange={(value) => onChange({ selectedCategory: value, minPrice, maxPrice })}
                />

                <div>
                    <label htmlFor="min-price" className="mb-1 block text-sm font-medium">
                        {t.minPrice}
                    </label>
                    <input
                        id="min-price"
                        type="number"
                        placeholder={t.minPricePlaceholder}
                        value={minPrice}
                        onChange={(e) => onChange({ selectedCategory, minPrice: e.target.value, maxPrice })}
                        className="w-full rounded-lg border border-navy-300 bg-surface px-3 py-2 text-sm text-navy-900 shadow-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"
                    />
                </div>

                <div>
                    <label htmlFor="max-price" className="mb-1 block text-sm font-medium">
                        {t.maxPrice}
                    </label>
                    <input
                        id="max-price"
                        type="number"
                        placeholder={t.maxPricePlaceholder}
                        value={maxPrice}
                        onChange={(e) => onChange({ selectedCategory, minPrice, maxPrice: e.target.value })}
                        className="w-full rounded-lg border border-navy-300 bg-surface px-3 py-2 text-sm text-navy-900 shadow-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"
                    />
                </div>
            </div>
        </div>
    )
}
