export default function ProductsSkeleton() {
   return (
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
         <div className="border-b border-border-subtle bg-navy-100/70 px-6 py-3.5 dark:bg-navy-900/50">
            <div className="h-3 w-40 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
         </div>
         {[0, 1, 2, 3, 4].map((row) => (
            <div
               key={row}
               className="flex items-center gap-x-4 border-b border-border-subtle/70 px-6 py-4 last:border-0"
            >
               <div className="h-4 w-16 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
               <div className="h-4 w-32 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
               <div className="h-4 flex-1 animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
               <div className="h-4 w-20 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
               <div className="h-8 w-8 animate-pulse rounded-lg bg-brand-500/15" />
               <div className="h-8 w-8 animate-pulse rounded-lg bg-navy-100 dark:bg-navy-800/70" />
            </div>
         ))}
      </div>
   )
}