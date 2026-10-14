export default function UsersSkeleton() {
   return (
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
         <div className="border-b border-border-subtle bg-navy-100/70 px-6 py-3.5 dark:bg-navy-900/50">
            <div className="h-3 w-32 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
         </div>
         {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-x-3 border-b border-border-subtle/70 px-6 py-4 last:border-0">
               <div className="h-9 w-9 animate-pulse rounded-full bg-linear-to-br from-brand-500/30 to-brand-700/30" />
               <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-navy-100 dark:bg-navy-800/70" />
               </div>
            </div>
         ))}
      </div>
   )
}