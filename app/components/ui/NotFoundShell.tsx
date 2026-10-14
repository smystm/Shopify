"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

interface NotFoundShellProps {
   /**
    * "router" uses a client-side <Link>; "hard" renders a plain anchor.
    *
    * global-not-found.tsx renders outside the app router, so it must do a full
    * document navigation. It passes this string rather than a callback — a
    * server component cannot pass a function into a client component.
    */
   navigation?: "router" | "hard"
   className?: string
}

const primaryCta =
   "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-[0.98]"

/** Small decorative tile that drifts like a lost marketplace item. */
function DriftingTile({ className, delay }: { className: string; delay: number }) {
   const prefersReduced = useReducedMotion()

   return (
      <motion.div
         aria-hidden="true"
         animate={prefersReduced ? undefined : { y: [0, -18, 0], rotate: [-2, 2, -2] }}
         transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay }}
         className={className}
      />
   )
}

export default function NotFoundShell({ navigation = "router", className = "" }: NotFoundShellProps) {
   const prefersReduced = useReducedMotion()
   const hard = navigation === "hard"

   const drift = prefersReduced
      ? undefined
      : { y: [0, -28, 0], scale: [1, 1.07, 1], transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const } }

   const driftAlt = prefersReduced
      ? undefined
      : {
           y: [0, 24, 0],
           scale: [1, 1.05, 1],
           transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const, delay: 1.6 },
        }

   return (
      <div
         dir="rtl"
         className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-100 px-4 py-12 font-vazirmatn dark:bg-navy-950 ${className}`}
      >
         {/* ---------- Ambient glows (Y/scale only, RTL-safe) ---------- */}
         <motion.div
            aria-hidden="true"
            animate={drift}
            className="pointer-events-none absolute -top-40 -start-40 h-[26rem] w-[26rem] rounded-full bg-brand-400/30 blur-[120px] dark:bg-brand-500/25"
         />
         <motion.div
            aria-hidden="true"
            animate={driftAlt}
            className="pointer-events-none absolute -bottom-48 -end-48 h-[28rem] w-[28rem] rounded-full bg-accent-400/25 blur-[120px] dark:bg-accent-500/20"
         />

         {/* ---------- Drifting tiles — the search that came back empty ---------- */}
         <DriftingTile
            delay={0}
            className="pointer-events-none absolute start-[12%] top-[22%] hidden h-16 w-16 rotate-6 rounded-2xl border border-brand-400/25 bg-brand-500/10 blur-[0.3px] lg:block"
         />
         <DriftingTile
            delay={2.4}
            className="pointer-events-none absolute end-[14%] top-[30%] hidden h-12 w-12 -rotate-6 rounded-2xl border border-accent-400/25 bg-accent-500/10 lg:block"
         />
         <DriftingTile
            delay={4.1}
            className="pointer-events-none absolute bottom-[24%] start-[22%] hidden h-10 w-10 rotate-12 rounded-xl border border-brand-400/20 bg-brand-500/8 lg:block"
         />

         {/* ---------- Grid texture ---------- */}
         <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-navy-600 opacity-[0.07] dark:text-navy-100 dark:opacity-[0.05]"
            style={{
               backgroundImage:
                  "linear-gradient(to left, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
               backgroundSize: "48px 48px",
            }}
         />

         <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 28, scale: prefersReduced ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-lg flex-col items-center text-center"
         >
            {/* ---------- Radar: searching, finding nothing ---------- */}
            <div className="relative flex h-40 w-40 items-center justify-center">
               {/* Expanding ping rings */}
               {!prefersReduced ? (
                  <>
                     <span aria-hidden="true" className="absolute inset-6 animate-ping rounded-full border-2 border-brand-500/30 [animation-duration:2.6s]" />
                     <span
                        aria-hidden="true"
                        className="absolute inset-2 animate-ping rounded-full border-2 border-accent-500/25 [animation-duration:2.6s] [animation-delay:600ms]"
                     />
                  </>
               ) : null}

               {/* Rotating turquoise→saffron ring; donut made with an inset
                   circle in the page colour, so no mask or prefix needed. */}
               <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-spin rounded-full bg-conic from-brand-500 via-accent-400 to-brand-500 opacity-70 [animation-duration:6s]"
               />
               <span aria-hidden="true" className="absolute inset-[3px] rounded-full bg-navy-100 dark:bg-navy-950" />

               {/* 404 */}
               <motion.span
                  animate={prefersReduced ? undefined : { scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative bg-linear-to-br from-brand-700 to-brand-800 bg-clip-text text-5xl font-extrabold tabular-nums text-transparent dark:from-brand-300 dark:to-brand-400"
               >
                  404
               </motion.span>
            </div>

            {/* ---------- Copy ---------- */}
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-700 dark:border-brand-400/30 dark:text-brand-300">
               {fa.notFound.code}
            </p>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-navy-950 dark:text-white md:text-3xl">{fa.notFound.title}</h1>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-navy-600 dark:text-navy-300">{fa.notFound.description}</p>

            {/* ---------- Actions ---------- */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
               {hard ? (
                  // global-not-found.tsx renders outside the app router, where a
                  // client-side <Link> has no router to navigate. A full document
                  // load is also the safer outcome for a "back to safety" page.
                  // eslint-disable-next-line @next/next/no-html-link-for-pages
                  <a href="/" className={primaryCta}>
                     <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-linear-to-l from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                     />
                     <span className="relative z-10">{fa.notFound.backHome}</span>
                  </a>
               ) : (
                  <Link href="/" className={primaryCta}>
                     <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-linear-to-l from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                     />
                     <span className="relative z-10">{fa.notFound.backHome}</span>
                  </Link>
               )}

               <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 text-sm font-bold text-navy-700 transition-all duration-300 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-200 dark:hover:text-brand-300"
               >
                  {fa.notFound.browseShop}
               </Link>
            </div>
         </motion.div>
      </div>
   )
}