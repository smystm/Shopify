"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { CART_CHANGED, getCartCount } from "@/app/helpers/cartApi"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The cart badge in the header.
 *
 * The count is fetched in an effect, never rendered on the server, so the header
 * HTML is identical on both sides of hydration. A count baked into the SSR output
 * would be a count from whenever that page was rendered, and it would disagree with
 * the cart the moment anything was added to it - which is exactly the mismatch the
 * nav links in this same header had to be guarded against.
 *
 * Nothing renders until the first answer arrives, and a failure renders an empty
 * badge rather than an error: the cart itself is one click away and will say so
 * properly, so the header is not the place to report that the shop is unreachable.
 */
export default function CartBadge() {
   const prefersReduced = useReducedMotion()
   const [units, setUnits] = useState<number | null>(null)

   useEffect(() => {
      let alive = true

      const refresh = () => {
         getCartCount()
            .then((count) => {
               if (alive) setUnits(count.units)
            })
            .catch(() => {
               if (alive) setUnits(0)
            })
      }

      refresh()
      window.addEventListener(CART_CHANGED, refresh)
      // Coming back through the browser's back button can reveal a cart that was
      // changed on another page, and no event fires for that.
      window.addEventListener("focus", refresh)

      return () => {
         alive = false
         window.removeEventListener(CART_CHANGED, refresh)
         window.removeEventListener("focus", refresh)
      }
   }, [])

   const shown = units ?? 0
   const label = shown > 0 ? fa.header.cartCount.replace("{count}", String(shown)) : fa.header.cartEmpty

   return (
      <Link
         href="/cart"
         aria-label={label}
         title={label}
         className="group relative -m-1.5 rounded-xl p-1.5 text-navy-600 transition-colors duration-300 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-300 dark:hover:text-brand-300"
      >
         <ShoppingCartIcon className="h-6 w-6 transition-transform duration-300 motion-safe:group-hover:-rotate-6" aria-hidden="true" />

         {shown > 0 ? (
            <motion.span
               key={shown}
               dir="ltr"
               initial={prefersReduced ? false : { scale: 0.4, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring", stiffness: 500, damping: 20 }}
               className="absolute -top-0.5 -end-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-linear-to-l from-brand-700 to-brand-600 px-1 text-[10px] font-extrabold text-white shadow-sm shadow-brand-700/40 ring-2 ring-surface dark:ring-navy-950"
            >
               {shown > 99 ? "99+" : shown}
            </motion.span>
         ) : null}
      </Link>
   )
}
