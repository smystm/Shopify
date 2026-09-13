export default function Loading() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Rotating ring with shopping-bag icon in the center */}
            <div className="relative flex h-20 w-20 items-center justify-center">
               <div className="absolute inset-0 animate-spin rounded-full border-4 border-zinc-200 border-t-violet-600 dark:border-zinc-800 dark:border-t-violet-400" />
               <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-pulse"
               >
                  <path d="M5 8h14l1 13H4L5 8Z" fill="#F5F5F5" />
                  <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 8h14l1 13H4L5 8Z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M7 12h10v5H7z" fill="#A78BFA" opacity=".35" />
               </svg>
            </div>

            <h2 className="mt-6 text-lg font-semibold tracking-tight">Loading your panel</h2>
            <p className="mt-1 text-sm text-zinc-500">
               Just a moment
               <span className="ml-0.5 inline-flex">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:150ms]">.</span>
                  <span className="animate-bounce [animation-delay:300ms]">.</span>
               </span>
            </p>

            {/* Shimmer placeholder rows */}
            <div className="mt-6 w-full space-y-3">
               <div className="h-3 w-3/4 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
               <div className="h-3 w-full animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
               <div className="h-3 w-2/3 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
            </div>
         </div>
      </div>
   )
}
