"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import { type AuthMode, type FormValues } from "../../contracts/auth/index"
import FormBase from "./FormBase"
import Button from "../ui/Button"
import type { FormikHelpers } from "formik"
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks"
import { setMode, loginSuccess, logout } from "../../lib/store/authSlice"
import CallApi from "@/app/helpers/CallApi"
import ValidationError from "@/app/exeptions/ValidationError"
import { useCookies } from "react-cookie"
import { fa } from "@/app/lib/i18n/fa"

export type { AuthMode }

interface AuthFormProps {
   mode: AuthMode
   setToken?: (token: string) => void
}

export default function AuthForm({ mode, setToken }: AuthFormProps) {
   const dispatch = useAppDispatch()
   const router = useRouter()
   const user = useAppSelector((s) => s.auth.user)
   const prefersReduced = useReducedMotion()

   const isSignup = mode === "signup"

   // `useCookies` requires <CookiesProvider> (see app/components/Providers.tsx).
   // Only the setter is needed here — reading the cookie is not.
   const [, setCookie, removeCookie] = useCookies(["shopy-token", "shopy-user"])

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
               setErrors({ phone: fa.authPages.invalidCredentials })
            } else {
               entries.forEach(([key, value]) => {
                  // Backend may send `{ email: ["Taken"] }` — Formik needs a string.
                  setFieldError(key, Array.isArray(value) ? value[0] : String(value))
               })
            }
            console.log("خطای اعتبارسنجی در فرم ورود", errors)
         } else {
            console.error("درخواست ناموفق بود", err)
            setErrors({ phone: fa.authPages.genericError })
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
         <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24, scale: prefersReduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-3xl border border-border-strong bg-surface p-8 text-center shadow-2xl shadow-navy-900/10 dark:shadow-black/30"
         >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-700 dark:text-brand-300">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 8h14l1 13H4L5 8Z" fill="currentColor" />
                  <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </span>
            <h2 className="mt-4 text-xl font-extrabold leading-snug text-navy-950 dark:text-white">
               {fa.authPages.welcomeUser.replace("{name}", user.name || user.phone || user.email || fa.header.fallbackUserName)}
            </h2>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">{fa.authPages.loggedInAs.replace("{phone}", user.phone ?? user.email ?? "")}</p>
            <Button onClick={handleLogout} className="mt-6">
               {fa.authPages.logout}
            </Button>
         </motion.div>
      )
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: prefersReduced ? 0 : 24, scale: prefersReduced ? 1 : 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
         className="w-full max-w-md rounded-3xl border border-border-strong bg-surface p-8 shadow-2xl shadow-navy-900/10 dark:shadow-black/30"
      >
         {/* Mode toggle — navigates between routes */}
         <div className="mb-6 grid grid-cols-2 rounded-full bg-surface-muted p-1">
            <Button variant="toggle" isActive={!isSignup} layoutId="auth-mode-pill" onClick={() => router.push("/login")}>
               {fa.authPages.submitLogin}
            </Button>
            <Button variant="toggle" isActive={isSignup} layoutId="auth-mode-pill" onClick={() => router.push("/register")}>
               {fa.authPages.submitSignup}
            </Button>
         </div>

         <h2 className="text-2xl font-extrabold leading-tight text-navy-950 dark:text-white">
            {isSignup ? fa.authPages.signupHeading : fa.authPages.loginHeading}
         </h2>
         <p className="mb-6 mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">
            {isSignup ? fa.authPages.signupSubtitle : fa.authPages.loginSubtitle}
         </p>

         <FormBase key={mode} mode={mode} onSubmit={handleSubmit} />
      </motion.div>
   )
}
