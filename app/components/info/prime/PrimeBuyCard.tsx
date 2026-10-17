"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
   ArrowLeftIcon,
   CheckIcon,
   ClockIcon,
   ExclamationTriangleIcon,
   LockClosedIcon,
   ShoppingCartIcon,
   WalletIcon,
} from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"
import type { ServicePrice } from "@/app/contracts/services"
import { CartApiError, addServiceToCart, isSignedOut } from "@/app/helpers/cartApi"
import { rememberCartIntent } from "@/app/helpers/cartIntent"
import { formatToman } from "@/app/lib/formatPrice"
import { PRIME_ARTWORK, REGION_FLAGS, REGION_LABELS } from "@/app/lib/regionAssets"
import { supportTelegramWithText } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

interface PrimeBuyCardProps {
   regions: readonly ServicePrice[]
}

/**
 * Fixed-size flag chip.
 *
 * The source flags are 80x42 to 80x53 and fully opaque, so they are cropped to a
 * uniform 1.6:1 chip instead of being letterboxed at their own ratios. `alt` is
 * empty on purpose: the country name always sits beside the flag, so announcing
 * it twice would just be noise.
 */
function RegionFlag({ variant }: { variant: string }) {
   const src = REGION_FLAGS[variant]
   if (!src) return null

   return (
      <span className="relative h-5 w-8 shrink-0 overflow-hidden rounded-[5px] ring-1 ring-navy-950/10 dark:ring-white/15">
         <Image src={src} alt="" fill sizes="32px" className="object-cover" unoptimized />
      </span>
   )
}

/**
 * The Prime buy card: what is being bought, choose a Steam region, read its price,
 * and put it in the cart.
 *
 * The primary action really adds the line now - the cart is account-backed, so a
 * signed-out visitor is sent to /login rather than being told no. Paying happens on
 * /cart, against the Toman wallet.
 *
 * Telegram stays here, demoted to a text link under the buttons. It is still the
 * only path that ends in a human arranging the trade by hand, which matters for the
 * customers who are not going to sign up today - but it is no longer the way in.
 */
export default function PrimeBuyCard({ regions }: PrimeBuyCardProps) {
   const prefersReduced = useReducedMotion()
   const router = useRouter()
   const copy = fa.info.prime

   const [selectedVariant, setSelectedVariant] = useState(regions[0]?.variant ?? "")
   const [addedVariant, setAddedVariant] = useState<string | null>(null)
   const [pending, setPending] = useState(false)
   const [problem, setProblem] = useState<{ text: string; signIn?: boolean } | null>(null)

   const selected = regions.find((region) => region.variant === selectedVariant) ?? regions[0]

   if (!selected) return null

   const inCart = addedVariant === selected.variant

   /**
    * Put the chosen region in the cart.
    *
    * Only the region is named: the backend prices the line itself, so the amount on
    * screen is never the amount of record. A region that sold out between the page
    * being rendered and the button being pressed is refused by the backend, and
    * that refusal is the one worth spelling out.
    *
    * The request is always sent, never gated on a local guess at the session: the
    * token is in an HttpOnly cookie the browser hides from JavaScript, so a
    * client-side check disagrees with the server and used to bounce the customer to
    * /login - and from there to /panel - without ever calling the cart API. A 403
    * is the backend saying "no account yet", and the pick is remembered so signing
    * in finishes the job.
    */
   const handleAddToCart = async () => {
      setPending(true)
      setProblem(null)

      try {
         await addServiceToCart(selected.service, selected.variant, 1)
         setAddedVariant(selected.variant)
         setTimeout(() => setAddedVariant(null), 3500)
      } catch (error) {
         if (isSignedOut(error)) {
            rememberCartIntent({ kind: "service", service: selected.service, variant: selected.variant, quantity: 1 })
            setProblem({ text: fa.cart.signInToAddHint, signIn: true })
            return
         }

         const outOfStock = error instanceof CartApiError && error.code === "OUT_OF_STOCK"
         setProblem({ text: outOfStock ? fa.cart.unavailable.out_of_stock : fa.products.addFailed })
      } finally {
         setPending(false)
      }
   }

   const telegramHref = supportTelegramWithText(
      [
         copy.orderIntro,
         `${copy.orderRegionLabel} ${REGION_LABELS[selected.variant] ?? selected.variant}`,
         `${copy.orderPriceLabel} ${formatToman(selected.price)} ${fa.currency}`,
      ].join("\n"),
   )

   const trustItems = [
      { Icon: ClockIcon, ...copy.trust.delivery },
      { Icon: WalletIcon, ...copy.trust.payment },
      { Icon: LockClosedIcon, ...copy.trust.security },
   ]

   return (
      <section className="py-16">
         <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-xl shadow-navy-900/5">
               {/* ---------- Product header ---------- */}
               <div className="group relative flex items-center gap-4 overflow-hidden border-b border-border-subtle bg-linear-to-b from-brand-50/60 to-surface px-7 py-6 md:gap-6 md:px-9 dark:from-brand-500/5">
                  {/* The hero cards' own grid texture, reused so the artwork reads
                      as the same product language as the rest of the store. */}
                  <span aria-hidden="true" className="hero-card-grid pointer-events-none absolute inset-0 opacity-40" />

                  <div className="relative h-28 w-24 shrink-0 md:h-32 md:w-28">
                     {/* A halo, not a spotlight. The badge is navy, and the dark
                         surface is navy too, so without this the shield loses its
                         silhouette; `.hero-card-spotlight` was tried first and is
                         built for a hero-sized card, where its 38% radial reads as
                         a glow rather than the flat teal disc it became here. */}
                     <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-4 rounded-full bg-brand-400/15 blur-2xl dark:bg-brand-500/25"
                     />
                     {/* `object-cover` in the artwork's own content ratio crops the
                        file's transparent side margins, so the shield fills the
                        tile instead of floating in a wide letterbox. */}
                     <Image
                        src={PRIME_ARTWORK}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 96px, 112px"
                        className="object-cover drop-shadow-[0_14px_26px_rgba(2,6,23,0.3)] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.07] motion-safe:group-hover:-rotate-2"
                        unoptimized
                     />
                  </div>

                  <div className="relative min-w-0">
                     <p className="text-[11px] font-bold tracking-wide text-brand-700 dark:text-brand-300">{copy.productEyebrow}</p>
                     <h2 className="mt-1 text-lg font-extrabold text-navy-950 md:text-xl dark:text-white">{copy.productName}</h2>
                     <p className="mt-1.5 max-w-lg text-xs leading-6 text-navy-600 md:text-sm dark:text-navy-300">{copy.productTagline}</p>
                  </div>
               </div>

               <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  {/* ---------- Region picker ---------- */}
                  <div className="p-7 md:p-9">
                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-bold text-navy-950 dark:text-white">{copy.pickerTitle}</h3>
                        {/* The unit rides the heading rather than every chip, so
                            six prices render as six numbers. */}
                        <span className="text-xs font-medium text-navy-500 dark:text-navy-400">({fa.currency})</span>
                     </div>
                     <p className="mt-2 max-w-lg text-sm leading-6 text-navy-600 dark:text-navy-300">{copy.pickerSubtitle}</p>

                     <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {regions.map((region, index) => {
                           const isSelected = region.variant === selected.variant

                           return (
                              <Reveal key={region.variant} delay={index * 0.05}>
                                 <motion.button
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setSelectedVariant(region.variant)}
                                    whileHover={prefersReduced ? undefined : { y: -5 }}
                                    whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                                    className={`group flex h-full w-full flex-col items-start gap-1.5 rounded-2xl border p-4 text-start transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                                       isSelected
                                          ? "border-brand-500/60 bg-linear-to-bl from-brand-50 to-surface shadow-lg shadow-brand-500/15 dark:border-brand-400/50 dark:from-brand-500/15 dark:to-navy-950"
                                          : "border-border-strong bg-surface hover:border-brand-400/60 dark:hover:border-brand-400/40"
                                    }`}
                                 >
                                    <span className="flex w-full items-center gap-2.5">
                                       <RegionFlag variant={region.variant} />
                                       <span className="min-w-0 truncate text-sm font-bold text-navy-900 dark:text-white">
                                          {REGION_LABELS[region.variant] ?? region.variant}
                                       </span>

                                       {isSelected ? (
                                          <motion.span
                                             initial={prefersReduced ? false : { scale: 0 }}
                                             animate={{ scale: 1 }}
                                             transition={{ type: "spring", stiffness: 420, damping: 20 }}
                                             className="ms-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm shadow-brand-700/30"
                                          >
                                             <CheckIcon className="h-3 w-3" aria-hidden="true" />
                                          </motion.span>
                                       ) : (
                                          <span
                                             aria-hidden="true"
                                             className="ms-auto h-5 w-5 shrink-0 rounded-full border border-navy-200 transition-colors duration-300 group-hover:border-brand-400/60 dark:border-navy-700"
                                          />
                                       )}
                                    </span>

                                    {/* dir=ltr so the grouped digits read left-to-right inside the RTL grid. */}
                                    <span
                                       dir="ltr"
                                       className={`text-sm font-extrabold transition-colors duration-300 ${
                                          isSelected
                                             ? "bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-transparent"
                                             : "text-navy-500 dark:text-navy-400"
                                       }`}
                                    >
                                       {formatToman(region.price)}
                                    </span>
                                 </motion.button>
                              </Reveal>
                           )
                        })}
                     </div>
                  </div>

                  {/* ---------- Price + action ---------- */}
                  <div className="border-t border-border-subtle bg-linear-to-bl from-brand-50/70 to-surface p-7 md:p-9 lg:border-s lg:border-t-0 dark:from-brand-500/10 dark:to-navy-950">
                     <p className="text-xs font-bold text-navy-500 dark:text-navy-400">{copy.priceLabel}</p>

                     <div className="mt-2 flex items-baseline gap-2">
                        {/* Keyed by region so the amount swipes up as the
                            selection changes, rather than cutting. */}
                        <AnimatePresence mode="wait" initial={false}>
                           <motion.span
                              key={selected.variant}
                              dir="ltr"
                              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                              className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-4xl font-extrabold text-transparent"
                           >
                              {formatToman(selected.price)}
                           </motion.span>
                        </AnimatePresence>

                        <span className="text-sm font-medium text-navy-500 dark:text-navy-400">{fa.currency}</span>
                     </div>

                     {/* Flag and name travel with the price, so the selection is
                         confirmed in two ways at once. */}
                     <div className="mt-2 flex h-5 items-center">
                        <AnimatePresence mode="wait" initial={false}>
                           <motion.span
                              key={selected.variant}
                              initial={prefersReduced ? false : { opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="flex items-center gap-2"
                           >
                              <RegionFlag variant={selected.variant} />
                              <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                                 {REGION_LABELS[selected.variant] ?? selected.variant}
                              </span>
                           </motion.span>
                        </AnimatePresence>
                     </div>

                     <ul className="mt-7 space-y-4">
                        {trustItems.map(({ Icon, title, body }) => (
                           <li key={title} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                                 <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span>
                                 <span className="block text-sm font-bold text-navy-900 dark:text-white">{title}</span>
                                 <span className="mt-0.5 block text-xs leading-5 text-navy-500 dark:text-navy-400">{body}</span>
                              </span>
                           </li>
                        ))}
                     </ul>

                     <div className="mt-8 space-y-3">
                        {/* Primary: into the cart, priced by the backend. */}
                        <motion.button
                           type="button"
                           onClick={() => void handleAddToCart()}
                           disabled={pending}
                           whileHover={prefersReduced || pending ? undefined : { y: -2 }}
                           whileTap={prefersReduced || pending ? undefined : { scale: 0.98 }}
                           transition={{ type: "spring", stiffness: 320, damping: 22 }}
                           className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait ${
                              inCart
                                 ? "bg-emerald-700 shadow-xl shadow-emerald-800/30"
                                 : "bg-linear-to-l from-brand-700 to-brand-800 shadow-lg shadow-brand-700/25 hover:shadow-xl hover:shadow-brand-700/40"
                           }`}
                        >
                           {!inCart && !pending ? (
                              <span
                                 aria-hidden="true"
                                 className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                              />
                           ) : null}

                           {pending ? (
                              <span
                                 aria-hidden="true"
                                 className="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                              />
                           ) : inCart ? (
                              <motion.span
                                 initial={prefersReduced ? false : { scale: 0, rotate: -45 }}
                                 animate={{ scale: 1, rotate: 0 }}
                                 transition={{ type: "spring", stiffness: 500, damping: 18 }}
                                 className="relative z-10"
                              >
                                 <CheckIcon className="h-4 w-4" aria-hidden="true" />
                              </motion.span>
                           ) : (
                              <ShoppingCartIcon className="relative z-10 h-4 w-4" aria-hidden="true" />
                           )}

                           <span className="relative z-10">
                              {pending ? copy.adding : inCart ? copy.addedToCart : copy.addToCart}
                           </span>
                        </motion.button>

                        {/* The refusal, and - when it is "no account yet" - the way in.
                            The pick is already remembered, so signing in finishes it. */}
                        {problem ? (
                           <p
                              role="status"
                              className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold leading-5 ${
                                 problem.signIn
                                    ? "border-brand-500/30 bg-brand-50/70 text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/10 dark:text-brand-300"
                                    : "border-accent-400/40 bg-accent-400/10 text-accent-800 dark:text-accent-300"
                              }`}
                           >
                              {problem.signIn ? (
                                 <ShoppingCartIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              ) : (
                                 <ExclamationTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              )}
                              <span>
                                 {problem.text}
                                 {problem.signIn ? (
                                    <>
                                       {" "}
                                       <button
                                          type="button"
                                          onClick={() => router.push("/login")}
                                          className="underline decoration-brand-500/50 underline-offset-2 transition-colors hover:decoration-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                                       >
                                          {fa.cart.loginCta}
                                       </button>
                                    </>
                                 ) : null}
                              </span>
                           </p>
                        ) : null}

                        {/* Onward: the cart while the addition is fresh, the wallet
                            the rest of the time - "now pay" and "you cannot pay yet"
                            are the only two things there are to say here. */}
                        {inCart ? (
                           <motion.div
                              initial={prefersReduced ? false : { opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                           >
                              <Link
                                 href="/cart"
                                 className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-700/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                              >
                                 {copy.viewCart}
                                 <ArrowLeftIcon
                                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                                    aria-hidden="true"
                                 />
                              </Link>
                           </motion.div>
                        ) : (
                           <Link
                              href="/panel/wallet"
                              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border-strong bg-surface px-6 py-3.5 text-sm font-bold text-navy-700 transition-colors duration-300 hover:border-brand-400/60 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-200 dark:hover:text-brand-300"
                           >
                              {copy.walletCta}
                           </Link>
                        )}

                        {/* The fallback, kept deliberately quiet. */}
                        <a
                           href={telegramHref}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="group inline-flex w-full items-center justify-center gap-1.5 rounded-2xl px-6 py-2 text-xs font-bold text-navy-500 transition-colors duration-300 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-400 dark:hover:text-brand-300"
                        >
                           {copy.telegramFallback}
                           <ArrowLeftIcon
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                              aria-hidden="true"
                           />
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </Reveal>
      </section>
   )
}
