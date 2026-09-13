"use client"

import AuthForm from "@/app/components/auth/AuthForm"
import { useAppDispatch } from "@/app/lib/store/hooks"
import { updatePhoneVerifyToken } from "@/app/lib/store/authSlice"

export default function LoginClient() {
   const dispatch = useAppDispatch()

   const setPhoneVerifyToken = (token: string) => {
      dispatch(updatePhoneVerifyToken(token))
   }

   return <AuthForm mode="login" setToken={setPhoneVerifyToken} />
}
