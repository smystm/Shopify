import UsersSkeleton from "@/app/components/admin/user/UsersSkeleton"

export default function Loading() {
    return (
      <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
             <div>
                <div className="h-7 w-28 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-2 h-4 w-56 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
             </div>
             <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mt-6">
             <UsersSkeleton />
          </div>
      </div>
    )
}
