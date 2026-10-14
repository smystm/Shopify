import { fa } from "@/app/lib/i18n/fa"

export default function Loading() {
   return (
      // No background or min-h-screen here — panel/layout.tsx already owns both.
      <div className="flex flex-col items-center justify-center py-16 font-vazirmatn">
         <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border border-border-strong bg-surface p-10 text-center shadow-2xl shadow-navy-900/10 dark:shadow-black/30">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-e-16 -top-16 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -inset-s-16 h-48 w-48 rounded-full bg-accent-400/15 blur-3xl" />

            <div className="relative flex h-20 w-20 items-center justify-center">
               <div className="absolute inset-0 animate-spin rounded-full border-4 border-navy-200 border-t-brand-600 dark:border-navy-800 dark:border-t-brand-400" />
               <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-700/25">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                     <path d="M5 8h14l1 13H4L5 8Z" fill="white" />
                     <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
               </div>
            </div>

            <h2 className="relative mt-6 text-lg font-extrabold text-navy-950 dark:text-white">{fa.panel.loadingTitle}</h2>
            <p className="relative mt-1 text-sm text-navy-600 dark:text-navy-300">
               {fa.panel.loadingHint}
               <span className="ms-0.5 inline-flex">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:150ms]">.</span>
                  <span className="animate-bounce [animation-delay:300ms]">.</span>
               </span>
            </p>

            {/* Shimmer placeholder rows */}
            <div className="relative mt-6 w-full space-y-3">
               <div className="h-3 w-3/4 animate-pulse rounded-full bg-navy-200/70 dark:bg-navy-800/80" />
               <div className="h-3 w-full animate-pulse rounded-full bg-navy-200/70 dark:bg-navy-800/80" />
               <div className="h-3 w-2/3 animate-pulse rounded-full bg-navy-200/70 dark:bg-navy-800/80" />
            </div>
         </div>
      </div>
   )
}