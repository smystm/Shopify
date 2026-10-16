"use client"

import { useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { replayCartIntent } from "@/app/helpers/cartIntent"
import { useAppSelector } from "@/app/lib/store/hooks"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Spends a remembered cart click once the customer is signed in.
 *
 * It lives here, beside the auth hydrator, rather than on the page that formed the
 * intention: the customer picked the item on a product page, signed in somewhere
 * else entirely, and should simply find it in the cart afterwards. Watching the
 * signed-in user in one place is also the only way this stays honest as more pages
 * learn to add to the cart.
 *
 * The attempt is keyed to the account, so switching users re-tries instead of
 * reporting a result the new account never got.
 */
export default function CartIntentReplay() {
   const user = useAppSelector((state) => state.auth.user)
   const attemptedFor = useRef<string | null>(null)

   useEffect(() => {
      if (!user) return

      const who = String(user.id ?? user.phone ?? "me")
      if (attemptedFor.current === who) return
      attemptedFor.current = who

      let alive = true

      void replayCartIntent().then((result) => {
         if (!alive) return

         if (result.status === "added") toast.success(fa.cart.intentRestored)
         // "waiting" means the sign-in has not reached the backend yet; clear the
         // guard so the next render is allowed to try again with the same note.
         if (result.status === "waiting") attemptedFor.current = null
      })

      return () => {
         alive = false
      }
   }, [user])

   return null
}
