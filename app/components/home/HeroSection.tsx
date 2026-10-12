import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
   return (
      <section className="relative md:w-3/4 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950 md:p-12 md:py-25">
         {/* Decorative background glow */}
         <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/40" />
         <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/40" />

         <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative z-10">
               <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  CS:GO Skins Market
               </span>
               <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-5xl">
                  Trade legendary skins with confidence
               </h1>
               <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Browse a curated collection of AK-47, AWP, and other iconic CS:GO skins. Clean catalog, fair rates, and real images for every item.
               </p>

               {/* Stats row */}
               <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                     <div className="text-xl font-bold text-zinc-950 dark:text-white">1.4k+</div>
                     <div className="mt-0.5 text-xs text-zinc-500">Items</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                     <div className="text-xl font-bold text-zinc-950 dark:text-white">34</div>
                     <div className="mt-0.5 text-xs text-zinc-500">Categories</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                     <div className="text-xl font-bold text-zinc-950 dark:text-white">34</div>
                     <div className="mt-0.5 text-xs text-zinc-500">Weapons</div>
                  </div>
               </div>

               {/* Metric row */}
               <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
                     <span className="h-2 w-2 rounded-full bg-emerald-500" />
                     Live catalog
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
                     <span className="h-2 w-2 rounded-full bg-amber-500" />
                     Fair rates
                  </span>
               </div>

               <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                     href="/products"
                     className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                     Browse products
                  </Link>
                  <Link
                     href="/register"
                     className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                     Create account
                  </Link>
               </div>
            </div>

            <div className="relative z-10 flex items-center justify-center">
               {/* Pulsing glow behind the image */}
               <div className="absolute inset-0 animate-[glow-pulse_3s_ease-in-out_infinite] rounded-full bg-zinc-300/40 blur-3xl dark:bg-zinc-800/30" />

               {/* Floating image card */}
               <div className="animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-shadow duration-500 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                  <Image
                     src="/images/weapons-real/skins/awp/awp-0001.png"
                     alt="AWP skin"
                     width={420}
                     height={420}
                     className="h-auto w-full object-contain"
                     unoptimized
                     priority
                  />
               </div>
            </div>
         </div>
      </section>
   )
}
