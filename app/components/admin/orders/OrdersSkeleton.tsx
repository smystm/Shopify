export default function OrdersSkeleton() {
   return (
      <div>
         {/* The summary tiles */}
         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((tile) => (
               <div
                  key={tile}
                  className="rounded-2xl border border-border-strong bg-surface p-4 shadow-sm shadow-navy-900/5"
               >
                  <div className="h-3 w-20 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                  <div className="mt-3 h-7 w-12 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
               </div>
            ))}
         </div>

         {/* The table */}
         <div className="mt-4 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
            <div className="border-b border-border-subtle bg-navy-100/70 px-6 py-3.5 dark:bg-navy-900/50">
               <div className="h-3 w-28 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
            </div>
            {[0, 1, 2, 3, 4].map((row) => (
               <div key={row} className="flex items-center gap-x-4 border-b border-border-subtle/70 px-6 py-4 last:border-0">
                  <div className="h-3.5 w-10 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                  <div className="h-3.5 w-24 animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
                  <div className="h-9 w-9 animate-pulse rounded-full bg-linear-to-br from-brand-500/25 to-brand-700/20 sm:hidden" />
                  <div className="flex-1" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-navy-100 dark:bg-navy-800/70" />
               </div>
            ))}
         </div>
      </div>
   )
}
