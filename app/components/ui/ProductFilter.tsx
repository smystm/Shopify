"use client"

import type { Category } from "@/app/contracts/products"
import SelectBox from "@/app/components/ui/SelectBox"

interface ProductFilterProps {
    categories: Category[]
    selectedCategory: string
    minPrice: string
    maxPrice: string
    onChange: (next: { selectedCategory: string; minPrice: string; maxPrice: string }) => void
}

export default function ProductFilter({
    categories,
    selectedCategory,
    minPrice,
    maxPrice,
    onChange,
}: ProductFilterProps) {
    const options = categories.map((c) => ({ value: c.value, label: c.value }))

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Filter products</h2>
                <button
                    type="button"
                    onClick={() => onChange({ selectedCategory: "", minPrice: "", maxPrice: "" })}
                    className="text-xs font-medium text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
                >
                    Clear all
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <SelectBox
                    name="category"
                    label="Category"
                    options={options}
                    value={selectedCategory}
                    placeholder="Select category"
                    onChange={(value) => onChange({ selectedCategory: value, minPrice, maxPrice })}
                />

                <div>
                    <label htmlFor="min-price" className="mb-1 block text-sm font-medium">
                        Min price
                    </label>
                    <input
                        id="min-price"
                        type="number"
                        placeholder="e.g. 100"
                        value={minPrice}
                        onChange={(e) => onChange({ selectedCategory, minPrice: e.target.value, maxPrice })}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                </div>

                <div>
                    <label htmlFor="max-price" className="mb-1 block text-sm font-medium">
                        Max price
                    </label>
                    <input
                        id="max-price"
                        type="number"
                        placeholder="e.g. 5000"
                        value={maxPrice}
                        onChange={(e) => onChange({ selectedCategory, minPrice, maxPrice: e.target.value })}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                </div>
            </div>
        </div>
    )
}
