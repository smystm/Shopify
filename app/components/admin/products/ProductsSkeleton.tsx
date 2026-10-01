export default function ProductsSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {[0, 1, 2, 3, 4].map((row) => (
                <div
                    key={row}
                    className="flex items-center gap-x-4 border-b border-zinc-100 px-6 py-4 last:border-0 dark:border-zinc-800/60"
                >
                    <div className="h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/70" />
                    <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
                    <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
                </div>
            ))}
        </div>
    )
}
