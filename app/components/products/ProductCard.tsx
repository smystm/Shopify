import type { AdminProduct } from "@/app/contracts/products"

interface ProductCardProps {
    product: AdminProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <div className="relative h-75 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <span className="absolute right-2 top-2 rounded-full bg-black/20 px-2 py-0.5 text-xs font-medium text-zinc-200 dark:text-zinc-300">
                    {product.category?.value ?? "General"}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{product.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{product.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">${product.price}</span>
                    <button
                        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}