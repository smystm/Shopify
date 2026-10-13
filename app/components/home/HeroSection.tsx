"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
   animate,
   motion,
   useInView,
   useReducedMotion,
   useScroll,
   useTransform,
} from "motion/react"
import { ArrowLeftIcon, BanknotesIcon, BoltIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"

interface HeroSectionProps {
   /** Present when the visitor is signed in; drives the secondary CTA + greeting. */
   displayName?: string | null
}

const STATS = [
   { value: 1400, suffix: "+", label: fa.home.stats.items },
   { value: 32, suffix: "", label: fa.home.stats.categories },
   { value: 32, suffix: "", label: fa.home.stats.weapons },
] as const

/** Counts up to `value` the first time it scrolls into view. */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
   const ref = useRef<HTMLSpanElement>(null)
   const inView = useInView(ref, { once: true, margin: "-60px" })
   const prefersReduced = useReducedMotion()
   const [display, setDisplay] = useState(0)

   useEffect(() => {
      // Reduced-motion users just get the final value (derived below),
      // so no state update is needed on that path.
      if (!inView || prefersReduced) return
      const controls = animate(0, value, {
         duration: 1.6,
         ease: "easeOut",
         onUpdate: (v) => setDisplay(Math.round(v)),
      })
      return () => controls.stop()
   }, [inView, prefersReduced, value])

   const shown = prefersReduced ? value : display

   return (
      <span ref={ref}>
         {shown.toLocaleString("en-US")}
         {suffix}
      </span>
   )
}

export default function HeroSection({ displayName }: HeroSectionProps) {
   const prefersReduced = useReducedMotion()
   const ref = useRef<HTMLElement>(null)

   const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
   const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60])
   const copyY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 26])

   const isSignedIn = Boolean(displayName)

   // Direction-neutral entrance (opacity + y only) so RTL never animates "wrong".
   const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }
   const item = {
      hidden: { opacity: 0, y: prefersReduced ? 0 : 22 },
      show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
   }

   return (
      <section
         ref={ref}
         className="relative overflow-hidden rounded-3xl border border-brand-500/15 bg-white/70 shadow-2xl shadow-navy-900/5 backdrop-blur-xl dark:border-brand-400/10 dark:bg-navy-950/60 dark:shadow-black/40"
      >
         {/* Ambient glows + grid texture */}
         <div className="pointer-events-none absolute -end-28 -top-28 h-80 w-80 rounded-full bg-brand-400/25 blur-[100px] dark:bg-brand-500/20" />
         <div className="pointer-events-none absolute -bottom-32 -start-24 h-80 w-80 rounded-full bg-accent-400/20 blur-[100px] dark:bg-accent-500/15" />
         <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-navy-400 opacity-[0.18] dark:text-navy-100 dark:opacity-[0.06]"
            style={{
               backgroundImage:
                  "linear-gradient(to left, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
               backgroundSize: "56px 56px",
            }}
         />

         <motion.div
            style={{ y: copyY }}
            className="relative z-10 grid grid-cols-1 items-center gap-12 p-8 md:p-14 lg:grid-cols-2"
         >
            {/* ---------- Copy ---------- */}
            <motion.div variants={container} initial="hidden" animate="show">
               <motion.span
                  variants={item}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300"
               >
                  {isSignedIn ? <SparklesIcon className="h-4 w-4" aria-hidden="true" /> : null}
                  {isSignedIn ? fa.home.heroGreeting.replace("{name}", displayName ?? "") : fa.home.heroBadge}
               </motion.span>

               <motion.h1
                  variants={item}
                  className="mt-6 text-4xl font-bold leading-tight tracking-tight text-navy-950 dark:text-white md:text-5xl md:leading-[1.15]"
               >
                  {fa.home.heroTitle}
               </motion.h1>

               <motion.p variants={item} className="mt-5 max-w-xl text-base leading-8 text-navy-600 dark:text-navy-300">
                  {fa.home.heroDescription}
               </motion.p>

               {isSignedIn ? (
                  <motion.p variants={item} className="mt-4 max-w-xl text-sm text-navy-500 dark:text-navy-400">
                     {fa.home.heroSignedInHint}
                  </motion.p>
               ) : null}

               <motion.div variants={item} className="mt-8 grid grid-cols-3 gap-3">
                  {STATS.map((s) => (
                     <div
                        key={s.label}
                        className="rounded-2xl border border-navy-200/70 bg-white/80 px-3 py-4 text-center shadow-sm dark:border-navy-700/60 dark:bg-navy-900/50"
                     >
                        <div className="bg-gradient-to-l from-brand-600 to-brand-400 bg-clip-text text-2xl font-bold text-transparent dark:from-brand-300 dark:to-brand-500">
                           <CountUp value={s.value} suffix={s.suffix} />
                        </div>
                        <div className="mt-1 text-xs text-navy-500 dark:text-navy-400">{s.label}</div>
                     </div>
                  ))}
               </motion.div>

               <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3 text-sm text-navy-600 dark:text-navy-300">
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-200/70 bg-white/70 px-3 py-1 dark:border-navy-700/60 dark:bg-navy-900/50">
                     <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                     </span>
                     {fa.home.metrics.liveCatalog}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-navy-200/70 bg-white/70 px-3 py-1 dark:border-navy-700/60 dark:bg-navy-900/50">
                     <BanknotesIcon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                     {fa.home.metrics.fairRates}
                  </span>
               </motion.div>

               {/* CTAs — only the auth-specific one swaps */}
               <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                     href="/products"
                     className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-brand-600 to-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:shadow-xl hover:shadow-brand-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                     {fa.home.cta.browseProducts}
                     <ArrowLeftIcon
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                        aria-hidden="true"
                     />
                  </Link>

                  {isSignedIn ? (
                     <Link
                        href="/panel"
                        className="inline-flex items-center gap-2 rounded-full border border-accent-400/50 bg-accent-50 px-7 py-3.5 text-sm font-bold text-accent-700 transition hover:bg-accent-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 dark:border-accent-400/30 dark:bg-accent-500/10 dark:text-accent-300 dark:hover:bg-accent-500/20"
                     >
                        <BoltIcon className="h-4 w-4" aria-hidden="true" />
                        {fa.home.cta.goToPanel}
                     </Link>
                  ) : (
                     <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-full border border-navy-300 bg-white/70 px-7 py-3.5 text-sm font-bold text-navy-700 transition hover:border-brand-400 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-navy-600 dark:bg-navy-900/50 dark:text-navy-100 dark:hover:border-brand-400 dark:hover:text-brand-300"
                     >
                        {fa.home.cta.createAccount}
                     </Link>
                  )}
               </motion.div>

               <motion.p
                  variants={item}
                  className="mt-6 inline-flex items-center gap-2 text-xs text-navy-500 dark:text-navy-400"
               >
                  <ShieldCheckIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                  {fa.home.features.items.authentic.title}
               </motion.p>
            </motion.div>

            {/* ---------- Visual ---------- */}
            <motion.div
               initial={{ opacity: 0, scale: 0.92, y: prefersReduced ? 0 : 26 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
               style={{ y: imageY }}
               className="relative z-10 flex items-center justify-center"
            >
               <div className="animate-shimmer absolute inset-8 rounded-full bg-brand-400/30 blur-[90px] dark:bg-brand-500/20" />

               <motion.div
                  animate={prefersReduced ? undefined : { y: [0, -14, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full max-w-sm"
               >
                  <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-400/40 via-transparent to-accent-400/40 blur-2xl" />
                  <div className="relative rounded-3xl border border-brand-500/20 bg-white/85 p-6 shadow-2xl shadow-navy-900/10 backdrop-blur dark:border-brand-400/15 dark:bg-navy-900/70 dark:shadow-black/40">
                     <Image
                        src="/images/weapons-real/skins/awp/awp-0001.png"
                        alt="AWP"
                        width={420}
                        height={420}
                        className="h-auto w-full object-contain drop-shadow-2xl"
                        unoptimized
                        priority
                     />
                     <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy-50/80 px-4 py-3 dark:bg-navy-950/60">
                        <div>
                           <div className="text-sm font-bold text-navy-900 dark:text-white">AWP | Dragon Lore</div>
                           <div className="text-xs text-navy-500 dark:text-navy-400">{fa.home.stats.weapons}</div>
                        </div>
                        <div className="rounded-full bg-accent-400/20 px-3 py-1 text-sm font-bold text-accent-600 dark:text-accent-300">
                           $ 1200
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         </motion.div>
      </section>
   )
}