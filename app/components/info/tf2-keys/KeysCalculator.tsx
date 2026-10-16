"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
   ArrowLeftIcon,
   CheckIcon,
   ExclamationTriangleIcon,
   MinusIcon,
   PlusIcon,
   ShieldCheckIcon,
   ShoppingCartIcon,
   TruckIcon,
} from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"
import { CartApiError, addServiceToCart } from "@/app/helpers/cartApi"
import { rememberCartIntent } from "@/app/helpers/cartIntent"
import { formatToman } from "@/app/lib/formatPrice"
import { TF2_KEY_ARTWORK } from "@/app/lib/regionAssets"
import { supportTelegramWithText } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

interface KeysCalculatorProps {
   /** Which service row this prices. */
   service: string
   /** Which variant of it - `key` today. */
   variant: string
   /** Toman per key, straight from `service_prices`. */
   price: string
   /** Units behind the bot, or null when the row carries no stock figure. */
   stock: number | null
   /** Per-order cap. Steam will not hold more than 50 keys in one account. */
   maxQuantity: number | null
}

const QUICK_PICKS = [1, 5, 10, 25, 50] as const

/** Ceiling used only when neither a stock nor a cap figure is known. */
const FALLBACK_CAP = 999

/**
 * Quantity calculator for TF2 keys: stock, price per key, a stepper and the live
 * payable amount.
 *
 * The amount is real arithmetic over the stored Toman price - but it is only what
 * the customer is about to be charged, not what they will be charged: checkout
 * re-reads the row. The primary action adds the chosen quantity to the cart, where
 * it is paid for from the Toman wallet.
 *
 * The amount shown here and the cart's own limit are derived from the same row, so
 * the two agree; the cart clamps to `min(stock, max_quantity)` for the same reason
 * this stepper does.
 */
export default function KeysCalculator({ service, variant, price, stock, maxQuantity }: KeysCalculatorProps) {
   const prefersReduced = useReducedMotion()
   const router = useRouter()
   const copy = fa.info.tf2Keys

   const limits = [stock, maxQuantity].filter((value): value is number => typeof value === "number" && value > 0)
   const allowedMax = limits.length > 0 ? Math.min(...limits) : FALLBACK_CAP
   const picks = [...new Set([...QUICK_PICKS.filter((preset) => preset <= allowedMax), allowedMax])].sort((a, b) => a - b)

   // The field keeps its own string so it can be cleared and retyped; the number
   // driving the total is always a clamped integer.
   const [draft, setDraft] = useState("1")
   const [added, setAdded] = useState(false)
   const [pending, setPending] = useState(false)
   const [problem, setProblem] = useState<{ text: string; signIn?: boolean } | null>(null)

   const parsed = Number.parseInt(draft, 10)
   const quantity = Number.isFinite(parsed) ? Math.min(allowedMax, Math.max(1, parsed)) : 1

   const clamp = (value: number) => Math.min(allowedMax, Math.max(1, Math.trunc(value)))

   const setQuantity = (next: number) => setDraft(String(clamp(next)))

   /**
    * Steppers derive from the previous draft, never from the rendered
    * `quantity`. React batches click handlers into one render, so a fast
    * double-click - or a held-down button - would otherwise have every handler
    * read the same stale quantity and the count would barely move.
    */
   const bumpQuantity = (delta: number) =>
      setDraft((previous) => {
         const current = Number.parseInt(previous, 10)
         return String(clamp((Number.isFinite(current) ? current : 1) + delta))
      })

   const handleDraft = (next: string) => {
      const digits = next.replace(/[^0-9]/g, "").slice(0, 4)
      if (digits === "") {
         setDraft("")
         return
      }
      setQuantity(Number.parseInt(digits, 10))
   }

   const unit = Number(price)
   const total = Number.isFinite(unit) ? unit * quantity : 0

   /**
    * Add the chosen number of keys to the cart.
    *
    * Adding twice accumulates, and the cart clamps the line to what is actually in
    * stock - so this sends what the customer asked for and lets the backend be the
    * one to say when that is too much.
    *
    * The request is always sent, never gated on a local guess at the session: the
    * token is in an HttpOnly cookie JavaScript cannot read, so the old client-side
    * check disagreed with the server and bounced the customer to /login - and from
    * there to /panel - without the cart ever being asked. A 403 is the backend
    * saying "no account yet", and the chosen quantity is remembered until signing
    * in turns it into a real line.
    */
   const handleAddToCart = async () => {
      setPending(true)
      setProblem(null)

      try {
         await addServiceToCart(service, variant, quantity)
         setAdded(true)
         setTimeout(() => setAdded(false), 3500)
      } catch (error) {
         if (error instanceof CartApiError && error.status === 403) {
            rememberCartIntent({ kind: "service", service, variant, quantity })
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
         `${copy.orderQuantityLabel} ${quantity} ${copy.stockUnit}`,
         `${copy.orderPriceLabel} ${formatToman(total)} ${fa.currency}`,
      ].join("\n"),
   )

   const trustItems = [
      { Icon: ShieldCheckIcon, ...copy.trust.payment },
      { Icon: TruckIcon, ...copy.trust.delivery },
   ]

   return (
      <section className="py-16">
         <Reveal>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-xl shadow-navy-900/5">
               {/* ---------- Product header ----------
                   The item itself first, so the numbers below have a face. The
                   gradient is a wash rather than a band: the price strip under it
                   already owns the tinted treatment. */}
               <div className="group relative flex items-center gap-4 overflow-hidden border-b border-border-subtle bg-linear-to-b from-brand-50/60 to-surface px-7 py-6 dark:from-brand-500/5">
                  {/* The hero cards' grid texture, reused so the artwork reads as
                      the same product language as the rest of the store. */}
                  <span aria-hidden="true" className="hero-card-grid pointer-events-none absolute inset-0 opacity-40" />

                  <div className="relative h-20 w-28 shrink-0 md:h-28 md:w-44">
                     {/* Soft halo behind the artwork - same treatment as the Prime
                         card, so both product headers read the same way. */}
                     <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-4 rounded-full bg-brand-400/15 blur-2xl dark:bg-brand-500/25"
                     />
                     <Image
                        src={TF2_KEY_ARTWORK}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 112px, 176px"
                        className="object-cover drop-shadow-[0_14px_26px_rgba(2,6,23,0.3)] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.07] motion-safe:group-hover:-rotate-2"
                        unoptimized
                     />
                  </div>

                  <div className="relative min-w-0">
                     <p className="text-[11px] font-bold tracking-wide text-brand-700 dark:text-brand-300">{copy.productEyebrow}</p>
                     <h2 className="mt-1 text-lg font-extrabold text-navy-950 dark:text-white">{copy.productName}</h2>
                     <p className="mt-1.5 text-xs leading-6 text-navy-600 dark:text-navy-300">{copy.productTagline}</p>
                  </div>
               </div>

               {/* ---------- Price per key + stock ---------- */}
               <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-linear-to-bl from-brand-50/60 to-surface px-7 py-6 dark:from-brand-500/10 dark:to-navy-950">
                  <div>
                     <p className="text-xs font-bold text-navy-500 dark:text-navy-400">{copy.pricePerKey}</p>
                     <p className="mt-1 flex items-baseline gap-2">
                        <span
                           dir="ltr"
                           className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-2xl font-extrabold text-transparent"
                        >
                           {formatToman(price)}
                        </span>
                        <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{fa.currency}</span>
                     </p>
                  </div>

                  {stock !== null ? (
                     <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-50/80 px-3.5 py-1.5 text-xs font-bold text-brand-700 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300">
                        {/* Live dot - the ping ring is decorative and removed for
                            anyone who asked for reduced motion. */}
                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                           <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75 motion-safe:animate-ping" />
                           <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
                        </span>
                        {copy.stockLabel}: <span dir="ltr">{stock}</span> {copy.stockUnit}
                     </span>
                  ) : null}
               </div>

               {/* ---------- Quantity ---------- */}
               <div className="px-7 py-7">
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{copy.quantityLabel}</p>
                  <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                     {copy.limitBefore} {maxQuantity} {copy.limitAfter}
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-4">
                     <button
                        type="button"
                        aria-label={copy.decrease}
                        disabled={quantity <= 1}
                        onClick={() => bumpQuantity(-1)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-strong bg-surface text-navy-700 transition hover:border-brand-400/70 hover:text-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-navy-700 dark:text-navy-200 dark:hover:text-brand-300 dark:disabled:hover:text-navy-200"
                     >
                        <MinusIcon className="h-4 w-4" aria-hidden="true" />
                     </button>

                     <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        aria-label={copy.quantityInput}
                        value={draft}
                        onChange={(event) => handleDraft(event.target.value)}
                        onBlur={() => setDraft(String(quantity))}
                        className="h-14 w-24 rounded-2xl border border-border-strong bg-surface text-center text-2xl font-extrabold text-navy-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 dark:text-white"
                     />

                     <button
                        type="button"
                        aria-label={copy.increase}
                        disabled={quantity >= allowedMax}
                        onClick={() => bumpQuantity(1)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-strong bg-surface text-navy-700 transition hover:border-brand-400/70 hover:text-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-navy-700 dark:text-navy-200 dark:hover:text-brand-300 dark:disabled:hover:text-navy-200"
                     >
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                     </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                     <span className="text-xs text-navy-500 dark:text-navy-400">{copy.quickPick}</span>
                     {picks.map((preset) => {
                        const isActive = preset === quantity
                        return (
                           <button
                              key={preset}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setQuantity(preset)}
                              className={`min-w-11 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                                 isActive
                                    ? "border-brand-500/60 bg-brand-600 text-white shadow-sm shadow-brand-700/25"
                                    : "border-border-strong bg-surface text-navy-600 hover:border-brand-400/60 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300"
                              }`}
                           >
                              <span dir="ltr">{preset}</span>
                           </button>
                        )
                     })}
                  </div>
               </div>

               {/* ---------- Payable amount + action ---------- */}
               <div className="border-t border-border-subtle px-7 py-7">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                     <div>
                        <p className="text-xs font-bold text-navy-500 dark:text-navy-400">{copy.totalLabel}</p>
                        <p dir="ltr" className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                           {quantity} × {formatToman(price)}
                        </p>
                     </div>

                     <p className="flex items-baseline gap-2">
                        <AnimatePresence mode="wait" initial={false}>
                           <motion.span
                              key={total}
                              dir="ltr"
                              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-3xl font-extrabold text-transparent"
                           >
                              {formatToman(total)}
                           </motion.span>
                        </AnimatePresence>
                        <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{fa.currency}</span>
                     </p>
                  </div>

                  <div className="mt-6 space-y-3">
                     {/* Primary: the chosen quantity into the cart. */}
                     <motion.button
                        type="button"
                        onClick={() => void handleAddToCart()}
                        disabled={pending}
                        whileHover={prefersReduced || pending ? undefined : { y: -2 }}
                        whileTap={prefersReduced || pending ? undefined : { scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait ${
                           added
                              ? "bg-emerald-700 shadow-xl shadow-emerald-800/30"
                              : "bg-linear-to-l from-brand-700 to-brand-800 shadow-lg shadow-brand-700/25 hover:shadow-xl hover:shadow-brand-700/40"
                        }`}
                     >
                        {!added && !pending ? (
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
                        ) : added ? (
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
                           {pending ? copy.adding : added ? copy.addedToCart : copy.addToCart}
                        </span>
                     </motion.button>

                     {/* The refusal, and - when it is "no account yet" - the way in.
                         The chosen quantity is already remembered, so signing in
                         finishes it. */}
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

                     {added ? (
                        <motion.div
                           initial={prefersReduced ? false : { opacity: 0, y: -6 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.3 }}
                        >
                           <Link
                              href="/cart"
                              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-700/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                     {trustItems.map(({ Icon, title, body }) => (
                        <li
                           key={title}
                           className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-navy-50/60 px-4 py-3 dark:bg-navy-900/40"
                        >
                           <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                           </span>
                           <span>
                              <span className="block text-xs font-bold text-navy-900 dark:text-white">{title}</span>
                              <span className="mt-0.5 block text-xs leading-5 text-navy-500 dark:text-navy-400">{body}</span>
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </Reveal>
      </section>
   )
}
