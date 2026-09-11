"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/app/lib/store/hooks"
import { loginSuccess, setHydrated } from "@/app/lib/store/authSlice"
import { getLoginUser } from "@/app/helpers/auth"

/**
 * Restores the Redux user from the `shopy-user` cookie on app mount,
 * so the "Welcome" state survives a page refresh. Rendered once inside
 * <Providers> — it renders nothing itself.
 */
export default function AuthHydrator() {
   const dispatch = useAppDispatch()

   useEffect(() => {
      const saved = getLoginUser()
      if (saved) dispatch(loginSuccess(saved))
      else dispatch(setHydrated(true))
      // loginSuccess already sets hydrated=true, so only the
      // "no cookie" path needs an explicit setHydrated.
   }, [dispatch])

   return null
}
