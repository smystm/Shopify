interface UsersEmptyStateProps {
    variant: "no-users" | "page-out-of-range"
    onGoToFirstPage?: () => void
}

export default function UsersEmptyState({ variant, onGoToFirstPage }: UsersEmptyStateProps) {
    if (variant === "page-out-of-range") {
        return (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-950">
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">There are no users on this page</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                    The page you requested doesn&apos;t exist.
                </p>
                {onGoToFirstPage && (
                    <button
                        type="button"
                        onClick={onGoToFirstPage}
                        className="mt-4 inline-flex items-center rounded-md bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        Go to page 1
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">No users yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                Newly registered users will appear here once the API returns them.
            </p>
        </div>
    )
}
