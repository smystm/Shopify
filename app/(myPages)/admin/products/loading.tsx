import ProductsSkeleton from "@/app/components/admin/products/ProductsSkeleton"

export default function Loading() {
    return (
      <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
             <div>
                <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
             </div>
             <div className="h-9 w-28 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mt-6">
             <ProductsSkeleton />
          </div>
      </div>
    )
}
