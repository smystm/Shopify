"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
   CheckCircleIcon,
   CreditCardIcon,
   ExclamationTriangleIcon,
   InformationCircleIcon,
   MinusIcon,
   PlusIcon,
   ShoppingCartIcon,
   TrashIcon,
   XCircleIcon,
} from "@heroicons/react/24/outline"
import type { Cart, CartLine } from "@/app/contracts/cart"
import { CartApiError, checkout, clearCart, getCart, removeCartLine, setCartQuantity } from "@/app/helpers/cartApi"
import { getPaymentConfig, getProfile } from "@/app/helpers/panelApi"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"
import { REGION_FLAGS } from "@/app/lib/regionAssets"
import { orderItemImage, orderItemLabel, orderItemQuantity } from "@/app/lib/orderItems"

const copy = fa.cart

/** Persian digits for a count inside a Persian sentence. */
const toPersianDigits = (value: number) =>
   String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])

/**
 * What the customer is told when a call fails.
 *
 * Keyed by the backend's machine code, never by its message - the message is
 * English and says things like "Not enough wallet balance", which is not what a
 * Persian storefront should be showing. Every code the cart and checkout can
 * return has an answer here; anything unrecognised falls back to a connection
 * apology rather than leaking a status code.
 */
function describeIssue(error: unknown): { title: string; body: string; topup?: boolean; profileCta?: string } {
   if (!(error instanceof CartApiError)) {
      return { title: copy.failedTitle, body: copy.netError }
   }

   switch (error.code) {
      case "INSUFFICIENT_FUNDS": {
         const need = Number(error.details?.required ?? 0)
         const balance = Number(error.details?.balance ?? 0)

         return {
            title: copy.insufficientTitle,
            body: copy.insufficientBody
               .replace("{need}", formatToman(need))
               .replace("{balance}", formatToman(balance)),
            topup: true,
         }
      }

      case "NO_TRADE_URL":
         return { title: copy.noTradeUrlTitle, body: copy.noTradeUrlBody, profileCta: copy.noTradeUrlCta }

      // Signing in through Steam does not supply a phone number, but paying still
      // needs one - so this is the same "finish your profile" answer the trade
      // link gets, pointing at the same screen.
      case "PHONE_REQUIRED":
         return { title: copy.phoneRequiredTitle, body: copy.phoneRequiredBody, profileCta: copy.phoneRequiredCta }

      case "ITEM_SOLD":
         return { title: copy.soldTitle, body: copy.soldBody }

      case "OUT_OF_STOCK":
         return { title: copy.soldOutTitle, body: copy.soldOutBody }

      case "CART_UNAVAILABLE":
         return { title: copy.soldTitle, body: copy.soldBody }

      case "CART_EMPTY":
         return { title: copy.emptyTitle, body: copy.emptyBody }

      default:
         return { title: copy.failedTitle, body: copy.netError }
   }
}

/** The Persian wording for why a line cannot be bought. */
function unavailableReason(flag: Exclude<CartLine["unavailable"], null>): string {
   return copy.unavailable[flag]
}

/**
 * Fixed-size flag chip, same treatment as the Prime buy card: the source files are
 * cropped to a uniform 1.6:1 chip. `alt` is empty because the region name is
 * always written beside it.
 */
function RegionFlag({ variant }: { variant: string | null }) {
   const src = variant ? REGION_FLAGS[variant] : undefined
   if (!src) return null

   return (
      <span className="relative h-4 w-7 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-navy-950/10 dark:ring-white/15">
         <Image src={src} alt="" fill sizes="28px" className="object-cover" unoptimized />
      </span>
   )
}

/** One cart line: artwork, what it is, how many, what it costs, and how to drop it. */
function CartRow({
   line,
   busy,
   onQuantity,
   onRemove,
}: {
   line: CartLine
   busy: boolean
   onQuantity: (quantity: number) => void
   onRemove: () => void
}) {
   const prefersReduced = useReducedMotion()
   const image = orderItemImage(line)
   const quantityBadge = lineQuantityBadge(line)
   const gone = line.unavailable !== null
   const isService = line.kind === "service"

   const stepButton =
      "flex h-9 w-9 items-center justify-center rounded-xl border border-border-strong bg-surface text-navy-700 transition-all duration-200 hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-navy-700 dark:text-navy-200 dark:hover:text-brand-300 dark:disabled:hover:text-navy-200"

   return (
      <motion.li
         layout={prefersReduced ? false : "position"}
         exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
         transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
         className={`group relative flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition-colors duration-300 sm:flex-nowrap ${
            gone
               ? "border-accent-400/50 bg-accent-400/5"
               : "border-border-strong bg-surface hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/5"
         }`}
      >
         {/* Artwork */}
         <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-muted">
            {image ? (
               <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className={`p-2 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105 ${
                     isService ? "object-cover" : "object-contain"
                  }`}
                  unoptimized
               />
            ) : (
               <ShoppingCartIcon className="h-6 w-6 text-navy-400" aria-hidden="true" />
            )}
         </span>

         {/* What it is */}
         <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
               <RegionFlag variant={isService ? line.variant : null} />
               <span className="min-w-0 truncate">{orderItemLabel(line)}</span>
            </p>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-500 dark:text-navy-400">
               <span>
                  {copy.unitPrice}: <span dir="ltr">{formatToman(line.price)}</span> {fa.currency}
               </span>
               {quantityBadge ? (
                  <span className="rounded-full bg-navy-100 px-2 py-0.5 font-bold dark:bg-navy-800" dir="ltr">
                     × {quantityBadge}
                  </span>
               ) : null}
            </p>

            {gone ? (
               <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-accent-700 dark:text-accent-400">
                  <XCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {unavailableReason(line.unavailable as Exclude<CartLine["unavailable"], null>)}
                  <span className="font-medium text-navy-500 dark:text-navy-400">{copy.unavailable.hint}</span>
               </p>
            ) : isService ? (
               <p className="mt-2 text-[11px] text-navy-500 dark:text-navy-400">
                  {copy.limitHint.replace("{limit}", String(line.limit))}
               </p>
            ) : line.limit <= 1 ? (
               <p className="mt-2 text-[11px] text-navy-500 dark:text-navy-400">{copy.skinSingleHint}</p>
            ) : (
               <p className="mt-2 text-[11px] text-navy-500 dark:text-navy-400">
                  {copy.stockRemaining.replace("{count}", toPersianDigits(line.available ?? line.limit))}
               </p>
            )}
         </div>

         {/* Quantity. Every line has one now: a service line because its cap can
             be several, a product line because the listing has stock. `line.limit`
             is what is left of it, computed by the backend, so the stepper cannot
             offer more than checkout would take. */}
         {!gone ? (
            <div className="flex items-center gap-2">
               <button
                  type="button"
                  aria-label={copy.quantityDecrease}
                  disabled={busy || line.quantity <= 1}
                  onClick={() => onQuantity(line.quantity - 1)}
                  className={stepButton}
               >
                  <MinusIcon className="h-4 w-4" aria-hidden="true" />
               </button>

               <span
                  dir="ltr"
                  className="flex h-9 min-w-12 items-center justify-center rounded-xl border border-border-strong bg-surface px-2 text-sm font-extrabold text-navy-950 dark:text-white"
               >
                  {busy ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /> : line.quantity}
               </span>

               <button
                  type="button"
                  aria-label={copy.quantityIncrease}
                  disabled={busy || line.quantity >= line.limit}
                  onClick={() => onQuantity(line.quantity + 1)}
                  className={stepButton}
               >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
               </button>
            </div>
         ) : (
            <span className="hidden w-[124px] shrink-0 sm:block" aria-hidden="true" />
         )}

         {/* What it costs */}
         <p className="flex w-32 shrink-0 flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">{copy.lineTotal}</span>
            <span
               dir="ltr"
               className={`text-base font-extrabold ${gone ? "text-navy-400 line-through dark:text-navy-500" : "text-navy-950 dark:text-white"}`}
            >
               {formatToman(line.lineTotal)}
            </span>
         </p>

         <button
            type="button"
            aria-label={copy.remove}
            disabled={busy}
            onClick={onRemove}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface text-navy-500 transition-all duration-200 hover:border-accent-400 hover:bg-accent-400/10 hover:text-accent-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-400 dark:hover:text-accent-400"
         >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
         </button>
      </motion.li>
   )
}

/** `× 3` - only drawn when a line was bought more than once. */
function lineQuantityBadge(line: CartLine): number | null {
   return orderItemQuantity(line)
}

/**
 * The cart: what is in it, what it costs, and the one button that pays for it.
 *
 * This is the mutable half of buying. Nothing here is committed until the
 * checkout call succeeds - before that the customer can change quantities, drop
 * lines and walk away, and no money has moved. When it does succeed, the reply is
 * the frozen order and the browser goes to its own page, which is what makes the
 * two halves visibly different things.
 *
 * Every request re-reads the whole cart and replaces the local copy, so there is no
 * client-side price to drift from the server's.
 */
export default function CartClient() {
   const prefersReduced = useReducedMotion()
   const router = useRouter()

   const [cart, setCart] = useState<Cart | null>(null)
   const [balance, setBalance] = useState<number | null>(null)
   const [gatewayConfigured, setGatewayConfigured] = useState<boolean | null>(null)
   const [loading, setLoading] = useState(true)
   const [signedOut, setSignedOut] = useState(false)
   const [busyLine, setBusyLine] = useState<number | null>(null)
   const [clearing, setClearing] = useState(false)
   const [checkingOut, setCheckingOut] = useState(false)
   const [issue, setIssue] = useState<{ title: string; body: string; topup?: boolean; profileCta?: string } | null>(null)

   const load = useCallback(async () => {
      try {
         setCart(await getCart())
         setSignedOut(false)
      } catch (error) {
         // 403 is the auth middleware, not a fault: the cart is account-backed, so
         // a signed-out visitor gets an invitation rather than an error.
         if (error instanceof CartApiError && error.status === 403) {
            setSignedOut(true)
         } else {
            setIssue(describeIssue(error))
         }
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      void load()

      // The wallet and the gateway are supporting detail: if either call fails the
      // cart still works, so neither is allowed to raise an issue banner.
      getProfile()
         .then((profile) => setBalance(profile?.balance ?? null))
         .catch(() => setBalance(null))

      getPaymentConfig()
         .then((config) => setGatewayConfigured(config.configured))
         .catch(() => setGatewayConfigured(null))
   }, [load])

   const runLine = async (lineId: number, work: () => Promise<Cart>) => {
      setBusyLine(lineId)
      setIssue(null)
      try {
         setCart(await work())
      } catch (error) {
         setIssue(describeIssue(error))
         // A refusal can mean the cart on the server has moved on - re-read rather
         // than leaving a stale row on screen.
         await load()
      } finally {
         setBusyLine(null)
      }
   }

   const handleCheckout = async () => {
      setCheckingOut(true)
      setIssue(null)
      try {
         const order = await checkout()
         // `placed=1` is what turns the confirmation banner on, exactly once - a
         // refresh of this URL re-shows it, which is harmless, and following a link
         // from the order list does not.
         router.push(`/panel/orders/${order.id}?placed=1`)
      } catch (error) {
         setIssue(describeIssue(error))
         await load()
      } finally {
         setCheckingOut(false)
      }
   }

   const handleClear = async () => {
      setClearing(true)
      setIssue(null)
      try {
         setCart(await clearCart())
      } catch (error) {
         setIssue(describeIssue(error))
      } finally {
         setClearing(false)
      }
   }

   const lines = cart?.lines ?? []
   const totals = cart?.totals ?? { lineCount: 0, unitCount: 0, subtotal: 0, unavailableCount: 0 }

   /** `null` while the balance is unknown, so no shortfall is claimed unmeasured. */
   const shortfall = useMemo(() => {
      if (balance === null) return null
      const missing = totals.subtotal - balance
      return missing > 0 ? missing : 0
   }, [balance, totals.subtotal])

   const blocked = totals.unavailableCount > 0
   const canCheckout = !blocked && !checkingOut && totals.subtotal > 0

   /* ------------------------------------------------------------- signed out */
   if (signedOut) {
      return (
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{copy.title}</h1>
            <div className="mt-8">
               <EmptyState
                  icon={<ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />}
                  title={copy.loginTitle}
                  body={copy.loginBody}
                  action={{ label: copy.loginCta, onClick: () => router.push("/login") }}
               />
            </div>
         </Reveal>
      )
   }

   /* ---------------------------------------------------------------- loading */
   if (loading) {
      return (
         <div>
            <div className="h-8 w-40 animate-pulse rounded-xl bg-navy-200 dark:bg-navy-800" />
            <div className="mt-8 space-y-4">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-border-strong bg-surface p-4">
                     <div className="h-20 w-20 animate-pulse rounded-2xl bg-navy-200 dark:bg-navy-800" />
                     <div className="flex-1 space-y-3">
                        <div className="h-4 w-40 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                        <div className="h-3 w-24 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )
   }

   /* ------------------------------------------------------------------ empty */
   if (lines.length === 0) {
      return (
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{copy.title}</h1>
            <div className="mt-8">
               <EmptyState
                  icon={<ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />}
                  title={copy.emptyTitle}
                  body={copy.emptyBody}
                  action={{ label: copy.emptyCta, onClick: () => router.push("/products") }}
               />
            </div>
         </Reveal>
      )
   }

   return (
      <div>
         <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
               <div>
                  <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{copy.title}</h1>
                  <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{copy.subtitle}</p>
               </div>

               <button
                  type="button"
                  onClick={handleClear}
                  disabled={clearing}
                  className="rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-bold text-navy-600 transition-colors duration-300 hover:border-accent-400 hover:text-accent-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-300 dark:hover:text-accent-400"
               >
                  {copy.clearAll}
               </button>
            </div>
         </Reveal>

         {/* Anything that cannot be bought has to be said before the total, not after. */}
         <AnimatePresence initial={false}>
            {blocked ? (
               <motion.p
                  initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-start gap-2.5 rounded-2xl border border-accent-400/50 bg-accent-400/10 px-4 py-3.5 text-sm font-bold leading-6 text-accent-800 dark:text-accent-300"
               >
                  <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  {copy.unavailable.banner.replace("{count}", String(totals.unavailableCount))}
               </motion.p>
            ) : null}
         </AnimatePresence>

         {/* A failed checkout, answered in the customer's own language. */}
         <AnimatePresence initial={false}>
            {issue ? (
               <motion.div
                  role="status"
                  initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 rounded-2xl border border-accent-400/50 bg-accent-400/10 px-4 py-4"
               >
                  <p className="text-sm font-bold text-accent-800 dark:text-accent-300">{issue.title}</p>
                  <p className="mt-1 text-xs leading-6 text-navy-700 dark:text-navy-200">{issue.body}</p>

                  {issue.topup ? (
                     <Link
                        href="/panel/wallet"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-700/25 transition-all duration-300 hover:shadow-lg"
                     >
                        <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
                        {copy.topupCta}
                     </Link>
                  ) : null}

                  {issue.profileCta ? (
                     <Link
                        href="/panel/profile"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-700/25 transition-all duration-300 hover:shadow-lg"
                     >
                        {issue.profileCta}
                     </Link>
                  ) : null}
               </motion.div>
            ) : null}
         </AnimatePresence>

         <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
            {/* ---------- Lines ---------- */}
            <ul className="space-y-3">
               <AnimatePresence initial={false}>
                  {lines.map((line) => (
                     <CartRow
                        key={line.id}
                        line={line}
                        busy={busyLine === line.id}
                        onQuantity={(quantity) => void runLine(line.id, () => setCartQuantity(line.id, quantity))}
                        onRemove={() => void runLine(line.id, () => removeCartLine(line.id))}
                     />
                  ))}
               </AnimatePresence>
            </ul>

            {/* ---------- Summary ---------- */}
            <Reveal>
               <div className="overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-lg shadow-navy-900/5 lg:sticky lg:top-24">
                  <div className="border-b border-border-subtle bg-linear-to-bl from-brand-50/70 to-surface px-6 py-5 dark:from-brand-500/10 dark:to-navy-950">
                     <h2 className="text-sm font-bold text-navy-950 dark:text-white">{copy.summaryTitle}</h2>
                  </div>

                  <dl className="space-y-3.5 px-6 py-5 text-sm">
                     <div className="flex items-center justify-between gap-3">
                        <dt className="text-navy-600 dark:text-navy-300">{copy.subtotal}</dt>
                        <dd className="font-bold text-navy-950 dark:text-white" dir="ltr">
                           {formatToman(totals.subtotal)}
                        </dd>
                     </div>

                     <div className="flex items-center justify-between gap-3">
                        <dt className="text-navy-600 dark:text-navy-300">{copy.linesCount.replace("{count}", totals.lineCount.toLocaleString("fa-IR"))}</dt>
                        <dd className="text-xs font-bold text-navy-500 dark:text-navy-400">
                           {copy.unitsSummary.replace("{count}", totals.unitCount.toLocaleString("fa-IR"))}
                        </dd>
                     </div>

                     <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3.5">
                        <dt className="text-navy-600 dark:text-navy-300">{copy.walletBalance}</dt>
                        <dd className="flex items-center gap-2 font-bold text-navy-950 dark:text-white" dir="ltr">
                           {balance === null ? "—" : formatToman(balance)}
                           {shortfall === 0 ? (
                              <CheckCircleIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                           ) : null}
                        </dd>
                     </div>
                  </dl>

                  <div className="border-t border-border-subtle bg-linear-to-bl from-brand-50/70 to-surface px-6 py-5 dark:from-brand-500/10 dark:to-navy-950">
                     <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-bold text-navy-500 dark:text-navy-400">{copy.payable}</span>
                        <span className="flex items-baseline gap-1.5">
                           {totals.unavailableCount > 0 ? (
                              <ExclamationTriangleIcon className="h-4 w-4 self-center text-accent-600" aria-hidden="true" />
                           ) : null}
                           <span
                              dir="ltr"
                              className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-2xl font-extrabold text-transparent"
                           >
                              {formatToman(totals.subtotal)}
                           </span>
                           <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{fa.currency}</span>
                        </span>
                     </div>

                     {shortfall !== null && shortfall > 0 ? (
                        <p className="mt-2 text-xs font-bold text-accent-700 dark:text-accent-400">
                           {copy.balanceShortfall.replace("{amount}", `${formatToman(shortfall)} ${fa.currency}`)}
                        </p>
                     ) : null}

                     <motion.button
                        type="button"
                        onClick={handleCheckout}
                        disabled={!canCheckout}
                        whileHover={prefersReduced || !canCheckout ? undefined : { y: -2 }}
                        whileTap={prefersReduced || !canCheckout ? undefined : { scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:shadow-none"
                     >
                        {canCheckout ? (
                           <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                           />
                        ) : null}

                        {checkingOut ? (
                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                        ) : (
                           <CreditCardIcon className="relative z-10 h-5 w-5" aria-hidden="true" />
                        )}
                        <span className="relative z-10">{checkingOut ? copy.checkoutProcessing : copy.checkoutCta}</span>
                     </motion.button>

                     <Link
                        href="/panel/wallet"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 text-xs font-bold text-navy-700 transition-colors duration-300 hover:border-brand-400/60 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-200 dark:hover:text-brand-300"
                     >
                        {copy.topupCta}
                     </Link>

                     {gatewayConfigured === false ? (
                        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-border-subtle bg-navy-50/60 px-3.5 py-3 text-[11px] leading-5 text-navy-600 dark:bg-navy-900/40 dark:text-navy-300">
                           <InformationCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                           <span>
                              <span className="block font-bold text-navy-800 dark:text-navy-100">{copy.gatewayTitle}</span>
                              {copy.gatewayPendingBody}
                           </span>
                        </p>
                     ) : null}
                  </div>
               </div>
            </Reveal>
         </div>
      </div>
   )
}
