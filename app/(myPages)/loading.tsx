export default function Loading() {
   return (
      <div dir="rtl" lang="fa" className="flex min-h-screen flex-col items-center justify-center bg-navy-100 px-4 py-12 font-vazirmatn dark:bg-navy-950">
         <div className="w-full max-w-md rounded-2xl border border-border-strong bg-surface p-8 shadow-md shadow-navy-900/5 dark:shadow-black/20">
            {/* Solid tokens, not translucent: navy-200/70 over the white card lands
                at 1.15:1 — fainter than the zinc-200 it replaces. */}
            <div className="h-7 w-2/3 animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
            <div className="mb-6 mt-2 h-4 w-1/2 animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
            <div className="space-y-3">
               <div className="h-11 w-full animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
               <div className="h-11 w-full animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
               <div className="h-11 w-full animate-pulse rounded-lg bg-navy-200 dark:bg-navy-700" />
            </div>
         </div>
      </div>
   )
}