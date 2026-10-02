"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { type AuthMode, type FormValues } from "../../contracts/auth/index"
import FormBase from "./FormBase"
import Button from "../ui/Button"
import type { FormikHelpers } from "formik"
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks"
import { setMode, loginSuccess, logout } from "../../lib/store/authSlice"
import CallApi from "@/app/helpers/CallApi"
import ValidationError from "@/app/exeptions/ValidationError"
import { useCookies } from "react-cookie"

export type { AuthMode }

interface AuthFormProps {
   mode: AuthMode
   setToken?: (token: string) => void
}

export default function AuthForm({ mode, setToken }: AuthFormProps) {
   const dispatch = useAppDispatch()
   const router = useRouter()
   const user = useAppSelector((s) => s.auth.user)

   const isSignup = mode === "signup"

   // `useCookies` requires <CookiesProvider> (see app/components/Providers.tsx).
   // It only returns the setter here — reading the cookie isn't needed.
    const [, setCookie, removeCookie] = useCookies(["shopy-token", "shopy-user"])

   // Keep redux mode in sync with the current route
   useEffect(() => {
      dispatch(setMode(isSignup ? "signup" : "login"))
   }, [dispatch, isSignup])

   const handleSubmit = async (values: FormValues, { setSubmitting, setErrors, setFieldError }: FormikHelpers<FormValues>) => {
      try {
         // const payload = isSignup ? { name: values.name, email: values.email, password: values.password, phone: values.phone } : { email: values.email, password: values.password }
         const payload = isSignup ? { name: values.name, phone: values.phone } : { phone: values.phone }
         const res = await CallApi().post(isSignup ? "/auth/register" : "/auth/login", payload)

         if (isSignup) {
            router.push("/login")
            return
         }else{
            if(res.status === 200){
               setToken?.(res.data.token)
               router.push('/login/verify')
               return
            }
         }
          if (res.status === 200) {
             const loggedInUser = {
                id: res.data.user?.id,
                name: res.data.user?.name ?? values.name,
                // email: res.data.user?.email ?? values.email,
                phone: res.data.user?.phone ?? values.phone,
                // Keep the permission from the backend so the admin UI can gate actions.
                permission: res.data.user?.permission,
             }
            setCookie("shopy-token", res.data?.user?.token, {
               maxAge: 3600 * 24 * 30,
               path: "/",
               sameSite: "lax",
            })
            setCookie("shopy-user", JSON.stringify(loggedInUser), {
               maxAge: 3600 * 24 * 30,
               path: "/",
               sameSite: "lax",
            })
            dispatch(loginSuccess(loggedInUser))
         }
      } catch (err: unknown) {
         if (err instanceof ValidationError) {
            const errors = err.errors ?? {}
            const entries = Object.entries(errors)
            if (entries.length === 0) {
               // setErrors({ email: "Invalid credentials. Please check your input." })
               setErrors({ phone: "Invalid credentials. Please check your input." })
            } else {
               entries.forEach(([key, value]) => {
                  // Backend may send `{ email: ["Taken"] }` — Formik needs a string.
                  setFieldError(key, Array.isArray(value) ? value[0] : String(value))
               })
            }
            console.log("Validation Error in Login Form", errors)
         } else {
            console.error("Auth request failed", err)
            // setErrors({ email: "Something went wrong. Please try again." })
            setErrors({ phone: "Something went wrong. Please try again." })
         }
      } finally {
         setSubmitting(false)
      }
   }


    if (user) {
      const handleLogout = () => {
         removeCookie("shopy-token", { path: "/" })
         removeCookie("shopy-user", { path: "/" })
         dispatch(logout())
      }
      return (
         <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold">Welcome, {user.name || user.phone || user.email}! 🎉</h2>
            <p className="mt-2 text-sm text-zinc-500">You are logged in as {user.phone ?? user.email}</p>
            <Button onClick={handleLogout} className="mt-6">
               Log out
            </Button>
         </div>
      )
   }

   return (
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
         {/* Mode toggle — navigates between routes */}
         <div className="mb-6 grid grid-cols-2 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
            <Button variant="toggle" isActive={!isSignup} onClick={() => router.push("/login")}>
               Log in
            </Button>
            <Button variant="toggle" isActive={isSignup} onClick={() => router.push("/register")}>
               Sign up
            </Button>
         </div>

         <h2 className="text-2xl font-semibold tracking-tight">{isSignup ? "Create your account" : "Welcome back"}</h2>
         <p className="mb-6 mt-1 text-sm text-zinc-500">{isSignup ? "Start shopping in seconds." : "Log in to continue shopping."}</p>

         <FormBase key={mode} mode={mode} onSubmit={handleSubmit} />
      </div>
   )
}
