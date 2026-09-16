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
         <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {[0, 1, 2, 3].map((row) => (
               <div
                  key={row}
                  className="flex items-center gap-x-3 border-b border-zinc-100 px-6 py-4 last:border-0 dark:border-zinc-800/60"
               >
                  <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                     <div className="h-3.5 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                     <div className="h-3 w-1/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/70" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
