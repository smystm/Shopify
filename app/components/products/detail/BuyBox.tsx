"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import {
   ArrowLeftIcon,
   CheckIcon,
   ExclamationTriangleIcon,
   ShieldCheckIcon,
   ShoppingCartIcon,
   TruckIcon,
} from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/app/contracts/products"
import { CartApiError, addProductToCart, isSignedOut } from "@/app/helpers/cartApi"
import { rememberCartIntent } from "@/app/helpers/cartIntent"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"
import QuantityStepper from "./QuantityStepper"

/**
 * Persian digits for a count shown in running text.
 *
 * `formatToman` already does this for money, which is why the amounts beside the
 * stepper read correctly and a bare number would not. Latin digits inside a
 * Persian sentence are the jarring case this avoids.
 */
const toPersianDigits = (value: number) =>
   String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

/**
 * How many copies of this listing can still be bought.
 *
 * `count` minus `sold_count`, read straight off the listing rather than derived
 * here, and a NULL count reads as one - so a listing nobody has stocked stays
 * one-of-a-kind instead of quietly becoming unlimited.
 */
function availableOf(product: AdminProduct): number {
   const total = typeof product.count === "number" && product.count > 0 ? product.count : 1
   const sold = typeof product.sold_count === "number" && product.sold_count > 0 ? product.sold_count : 0

   return Math.max(0, total - sold)
}

/**
 * The buy box: price, the quantity, the button, and the two ways it can fail.
 *
 * The request is always sent. The token lives in an HttpOnly cookie, which
 * JavaScript cannot read, so a local "am I signed in?" guess disagrees with the
 * server: the old check sent the customer to /login, which - seeing the cookie -
 * bounced them on to /panel, and the cart was never asked anything at all. Only
 * the backend can answer that question, so it is the one that does. A 403
 * therefore means genuinely signed out, and the pick is remembered so signing in
 * finishes the job.
 */
export default function BuyBox({ product }: { product: AdminProduct }) {
   const router = useRouter()
   const [quantity, setQuantity] = useState(1)
   const [added, setAdded] = useState(false)
   const [pending, setPending] = useState(false)
   const [problem, setProblem] = useState<{ text: string; signIn?: boolean } | null>(null)
   const prefersReduced = useReducedMotion()

   const available = availableOf(product)
   const sold = available <= 0
   const chosen = Math.min(quantity, Math.max(1, available))

   const handleAddToCart = async () => {
      setPending(true)
      setProblem(null)

      try {
         await addProductToCart(product.id, chosen)
         setAdded(true)
         setTimeout(() => setAdded(false), 2600)
      } catch (error) {
         if (isSignedOut(error)) {
            rememberCartIntent({ kind: "product", productId: product.id })
            setProblem({ text: fa.cart.signInToAddHint, signIn: true })
            return
         }

         // A sold-out skin is the one refusal worth naming: it is not a glitch, the
         // item is genuinely gone, and retrying will not help.
         const gone =
            error instanceof CartApiError &&
            (error.code === "PRODUCT_SOLD" || error.code === "PRODUCT_NOT_FOUND" || error.code === "OUT_OF_STOCK")
         setProblem({ text: gone ? fa.products.soldOut : fa.products.addFailed })
      } finally {
         setPending(false)
      }
   }

   return (
      <div>
         <p className="mt-4 flex items-baseline gap-2">
            <span
               dir="ltr"
               className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-4xl font-extrabold text-transparent"
            >
               {formatToman(Number(product.price) * chosen)}
            </span>
            {/* The one surface with no adjacent label to carry the unit,
                so it is spelled out beside the amount. */}
            <span className="text-lg font-bold text-navy-500 dark:text-navy-400">{fa.currency}</span>
         </p>

         <p className="mt-4 text-base leading-7 text-navy-600 dark:text-navy-300">{product.desc}</p>

         {/* Quantity, and the stock it is drawn from.
             The ceiling is what is left of the listing, not a number chosen here -
             so the stepper cannot offer more than checkout would take. */}
         <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
               <p className="text-sm font-bold text-navy-800 dark:text-navy-100">{fa.products.quantity}</p>

               {!sold ? (
                  <p className="flex items-center gap-2 text-xs font-bold text-navy-500 dark:text-navy-400">
                     <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                     </span>
                     {fa.products.stockRemaining.replace("{count}", toPersianDigits(available))}
                  </p>
               ) : null}
            </div>

            <div className="mt-3">
               {sold ? (
                  <p className="inline-flex items-center gap-2 rounded-2xl border border-accent-400/40 bg-accent-400/10 px-4 py-3 text-sm font-bold text-accent-800 dark:text-accent-300">
                     {fa.products.specs.sold}
                  </p>
               ) : (
                  <QuantityStepper
                     value={chosen}
                     max={Math.max(1, available)}
                     onChange={setQuantity}
                     disabled={pending}
                     labels={{ decrease: fa.products.quantityDecrease, increase: fa.products.quantityIncrease }}
                  />
               )}
            </div>

            {chosen > 1 ? (
               <p className="mt-3 text-xs leading-5 text-navy-500 dark:text-navy-400">
                  {fa.products.lineTotalHint
                     .replace("{count}", toPersianDigits(chosen))
                     .replace("{total}", formatToman(Number(product.price) * chosen))}
               </p>
            ) : null}
         </div>

         <div className="mt-6">
            {/* `group` lives on the button so the shine is driven by the
                button's hover, not the (unreachable) translated span. */}
            <motion.button
               type="button"
               onClick={() => void handleAddToCart()}
               disabled={pending || sold}
               whileHover={prefersReduced || pending || sold ? undefined : { y: -2 }}
               whileTap={prefersReduced || pending || sold ? undefined : { scale: 0.98 }}
               transition={{ type: "spring", stiffness: 320, damping: 22 }}
               className={classNames(
                  "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
                  sold
                     ? "cursor-not-allowed bg-navy-300 dark:bg-navy-800 dark:text-navy-400"
                     : added
                       ? "bg-emerald-700 shadow-xl shadow-emerald-800/30"
                       : "bg-linear-to-l from-brand-700 to-brand-800 shadow-lg shadow-brand-700/30 hover:shadow-xl hover:shadow-brand-700/45",
               )}
            >
               {!added && !pending && !sold ? (
                  /* Sits behind the label (-z-10) so it can never wash out
                     the text, and is driven by the button's hover via group. */
                  <span
                     aria-hidden="true"
                     className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full"
                  />
               ) : null}

               {sold ? (
                  <span className="relative z-10 text-base font-extrabold">{fa.products.specs.sold}</span>
               ) : pending ? (
                  <span
                     className="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                     aria-hidden="true"
                  />
               ) : added ? (
                  <motion.span
                     initial={prefersReduced ? false : { scale: 0, rotate: -45 }}
                     animate={{ scale: 1, rotate: 0 }}
                     transition={{ type: "spring", stiffness: 500, damping: 18 }}
                     className="relative z-10"
                  >
                     <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
               ) : (
                  <ShoppingCartIcon className="relative z-10 h-5 w-5" aria-hidden="true" />
               )}

               <span className="relative z-10">
                  {sold ? fa.products.specs.sold : pending ? fa.products.addingToCart : added ? fa.products.addedToCart : fa.products.addToCart}
               </span>
            </motion.button>

            {/* The one place on this page that answers a refusal - and, when the
                refusal is "no account yet", the way in. The item is already
                remembered, so signing in finishes the job. */}
            {problem ? (
               <p
                  role="status"
                  className={classNames(
                     "mt-3 flex items-start gap-2 text-xs font-bold leading-5",
                     problem.signIn ? "text-brand-700 dark:text-brand-300" : "text-accent-700 dark:text-accent-400",
                  )}
               >
                  {problem.signIn ? (
                     <ShoppingCartIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                     <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
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
                  className="mt-3"
               >
                  <Link
                     href="/cart"
                     className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-500/40 bg-brand-50/70 px-6 py-3 text-sm font-bold text-brand-700 transition-colors duration-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-300"
                  >
                     {fa.products.cartCta}
                     <ArrowLeftIcon className="h-4 w-4 rtl:scale-x-[-1]" aria-hidden="true" />
                  </Link>
               </motion.div>
            ) : null}
         </div>

         <TrustRow />
      </div>
   )
}

function TrustRow() {
   return (
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
         <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 transition-colors hover:border-brand-400/50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-400">
               <TruckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold leading-5 text-navy-700 dark:text-navy-200">{fa.products.freeShipping}</span>
         </div>
         <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 transition-colors hover:border-accent-400/60">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/20 text-accent-700 dark:text-accent-400">
               <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold leading-5 text-navy-700 dark:text-navy-200">{fa.products.returnPolicy}</span>
         </div>
      </div>
   )
}