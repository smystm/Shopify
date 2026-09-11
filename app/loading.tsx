export default function Loading() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="h-7 w-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="mb-6 mt-2 h-4 w-1/2 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            <div className="space-y-3">
               <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
               <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
               <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
         </div>
      </div>
   )
}
