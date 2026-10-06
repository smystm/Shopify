"use client"

import { useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { MinusIcon, PlusIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import type { AdminProduct } from "@/app/contracts/products"

interface ProductDetailProps {
    product: AdminProduct
}

function classNames(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ")
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const formatDate = (date: number | string | null | undefined): string => {
        if (!date) return "N/A"
        const d = new Date(date)
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href="/products"
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Products
            </Link>

            <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            unoptimized
                            className="object-contain p-10"
                        />
                    ) : null}
                    <span className="absolute right-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-zinc-200 dark:text-zinc-300">
                        {product.category?.value ?? "General"}
                    </span>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                        {product.title}
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        SKU: {product.productNumber}
                    </p>

                    <p className="mt-4 text-3xl font-bold text-zinc-950 dark:text-white">
                        ${product.price}
                    </p>

                    <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {product.desc}
                    </p>

                    <div className="mt-8">
                        <label htmlFor="quantity" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                            Quantity
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <MinusIcon className="h-4 w-4" />
                            </button>
                            <input
                                id="quantity"
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="h-10 w-16 rounded-lg border border-zinc-300 bg-white text-center text-sm font-medium text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <PlusIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={classNames(
                                "flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition",
                                added
                                    ? "bg-green-600 text-white"
                                    : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
                            )}
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            {added ? "Added to Cart!" : "Add to Cart"}
                        </button>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                            <TruckIcon className="h-5 w-5 text-zinc-400" />
                            Free shipping on orders over $50
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                            <ShieldCheckIcon className="h-5 w-5 text-zinc-400" />
                            30-day return policy
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <TabGroup>
                    <TabList className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
                        {["Description", "Details", "Shipping"].map((tab) => (
                            <Tab
                                key={tab}
                                className={({ selected }) =>
                                    classNames(
                                        "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none",
                                        selected
                                            ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
                                    )
                                }
                            >
                                {tab}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-6">
                        <TabPanel className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {product.desc}
                            </p>
                            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                                This product is part of our premium collection. Crafted with quality materials and designed for everyday use.
                            </p>
                        </TabPanel>
                        <TabPanel className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Product Number</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">{product.productNumber}</dd>
                                </div>
                                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Category</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">{product.category?.value ?? "General"}</dd>
                                </div>
                                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Price</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">${product.price}</dd>
                                </div>
                                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Created</dt>
                                    <dd className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">{formatDate(product.created_at)}</dd>
                                </div>
                            </dl>
                        </TabPanel>
                        <TabPanel className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Shipping Information</h3>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        Free standard shipping on all orders over $50. Orders are processed within 1-2 business days.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Estimated Delivery</h3>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        5-7 business days for standard shipping. Express shipping available at checkout.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Returns</h3>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        30-day return policy. Items must be in original condition with tags attached.
                                    </p>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    )
}
