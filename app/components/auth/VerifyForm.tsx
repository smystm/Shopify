"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import { type FormikHelpers } from "formik"
import * as Yup from "yup"
import Button from "../ui/Button"
import { FormShell } from "./FormBase"
import CallApi from "@/app/helpers/CallApi"
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks"
import { loginSuccess, selectPhoneVerifyToken, updatePhoneVerifyToken } from "@/app/lib/store/authSlice"
import { storeLoginToken, storeLoginUser } from "@/app/helpers/auth"
import { fa } from "@/app/lib/i18n/fa"

export interface VerifyValues {
   code: string
   token: string
}

export const verifyInitialValues: VerifyValues = {
   code: "",
   token: "",
}

export const verifySchema = Yup.object({
   code: Yup.string()
      .required(fa.authPages.codeRequired)
      .length(6, fa.authPages.codeLength)
      .matches(/^\d{6}$/, fa.authPages.codeDigits),
})

interface VerifyFormProps {
   /** Phone number the code was sent to. Shown as a hint only. */
   phone?: string
   initialValues?: VerifyValues
   /** TODO: wire up in the next step — called with the 6-digit code on submit. */
   onVerify?: (code: string) => void | Promise<void>
   /** TODO: wire up in the next step — called when "Resend code" is clicked. */
   onResend?: () => void
   /** TODO: wire up in the next step — loading states for the buttons. */
   isVerifying?: boolean
   isResending?: boolean
   /** TODO: wire up in the next step — server-side error message slot. */
   error?: string | null
}

const CODE_LENGTH = 6

const otpInputClass =
   "h-14 w-full rounded-2xl border-2 border-navy-400 bg-surface text-center text-xl font-extrabold text-navy-950 caret-brand-600 outline-none transition-all duration-200 placeholder:text-navy-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:caret-brand-300"

export default function VerifyForm({ phone, initialValues = verifyInitialValues, onVerify, onResend, isVerifying = false, isResending = false, error = null }: VerifyFormProps) {
   const router = useRouter()
   const inputsRef = useRef<Array<HTMLInputElement | null>>([])
   const prefersReduced = useReducedMotion()

   const dispatch = useAppDispatch()

   const token = useAppSelector(selectPhoneVerifyToken)

   const clearPhoneToken = () => {
      dispatch(updatePhoneVerifyToken(undefined))
   }

   useEffect(() => {
      // Back to the start, not on to the dashboard. An empty store means this page
      // was opened directly or refreshed - nobody is mid-verification - and the old
      // bounce to /panel looked like a sign-in that had quietly succeeded while
      // nothing had been verified at all.
      if (token === undefined) router.push("/login")
   }, [token, router])

   const handleBack = () => {
      clearPhoneToken()
      router.push("/login")
   }

   const focusAt = (index: number) => {
      inputsRef.current[index]?.focus()
      inputsRef.current[index]?.select()
   }

   const handleSubmit = async (values: VerifyValues, helpers: FormikHelpers<VerifyValues>) => {
      const res = await CallApi().post("/auth/login/verify-phone", { code: values.code, token: token })
      if (res.status === 200) {
          const verifiedUser = {
             id: res.data?.user?.id,
             name: res.data?.user?.name,
             email: res.data?.user?.email,
             phone: res.data?.user?.phone,
             // Keep the permission from the backend so the admin UI can gate actions.
             permission: res.data?.user?.permission,
          }

         // Awaited, and deliberately not clearing the phone token first: both write
         // the cookies the *next server render* reads, so pushing before they land
         // renders the page that follows as a signed-out one. Clearing the token
         // would also trip the guard above on the way out and send a just-signed-in
         // customer back to /login - the page unmounts on navigation, so there is
         // nothing to reset here anyway.
         await storeLoginToken(res.data?.user?.token)
         await storeLoginUser(verifiedUser)

         dispatch(loginSuccess(verifiedUser))
         router.push("/")
      }

      await onVerify?.(values.code)
      helpers.setSubmitting(false)
   }

   const handleResend = () => {
      if (isResending) return
      // TODO: resend-code logic goes here.
      onResend?.()
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: prefersReduced ? 0 : 24, scale: prefersReduced ? 1 : 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
         className="w-full max-w-md rounded-3xl border border-border-strong bg-surface p-8 shadow-2xl shadow-navy-900/10 dark:shadow-black/30"
      >
         <h2 className="text-2xl font-extrabold leading-tight text-navy-950 dark:text-white">{fa.authPages.verifyHeading}</h2>
         <p className="mb-6 mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">
            {phone ? fa.authPages.verifySentTo.replace("{phone}", phone) : fa.authPages.verifySentHint}
         </p>

         <FormShell<VerifyValues> initialValues={initialValues} validationSchema={verifySchema} onSubmit={handleSubmit}>
            {({ values, errors, touched, isSubmitting, setFieldValue, setTouched }) => {
               const digits = Array.from({ length: CODE_LENGTH }, (_, i) => values.code[i] ?? "")
               const hasError = Boolean(touched.code && errors.code)
               const isComplete = values.code.length === CODE_LENGTH
               const busy = isSubmitting || isVerifying

               const setDigit = (index: number, value: string) => {
                  const digit = value.replace(/\D/g, "").slice(-1)
                  const next = digits.slice()
                  next[index] = digit
                  void setFieldValue("code", next.join(""))
                  if (digit && index < CODE_LENGTH - 1) focusAt(index + 1)
               }

               const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Backspace" && !digits[index] && index > 0) focusAt(index - 1)
               }

               const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
                  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
                  if (!pasted) return
                  e.preventDefault()
                  void setFieldValue("code", pasted)
                  void setTouched({ code: true })
                  focusAt(Math.min(pasted.length, CODE_LENGTH - 1))
               }

               return (
                  <>
                     <div>
                        <div className="flex justify-between gap-2" dir="ltr" onPaste={handlePaste}>
                           {digits.map((digit, i) => (
                              <motion.div
                                 key={`box-${i}`}
                                 initial={false}
                                 /* Over-scale pop the moment a digit lands. Empty boxes rest at full
                                  scale/opacity — dimming them read as broken. */
                                 animate={digit ? { scale: [0.88, 1.06, 1] } : { scale: 1, opacity: 1 }}
                                 transition={prefersReduced ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                                 className="flex-1"
                              >
                                 <input
                                    ref={(el) => {
                                       inputsRef.current[i] = el
                                    }}
                                    name={`code-${i}`}
                                    value={digit}
                                    onChange={(e) => setDigit(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onBlur={() => setTouched({ code: true })}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete={i === 0 ? "one-time-code" : "off"}
                                    maxLength={1}
                                    aria-label={fa.authPages.digitLabel.replace("{index}", String(i + 1))}
                                    aria-invalid={hasError}
                                    /* Digits are numeric — force LTR so the caret and
                                       selection don't inherit the RTL flow. */
                                    dir="ltr"
                                    className={`${otpInputClass} ${hasError ? "border-red-500 ring-2 ring-red-500/15" : ""}`}
                                 />
                              </motion.div>
                           ))}
                        </div>

                        {/* Progress — grows with the number of digits entered. */}
                        <div
                           role="progressbar"
                           aria-valuemin={0}
                           aria-valuemax={CODE_LENGTH}
                           aria-valuenow={values.code.length}
                           /* LTR so the fill grows left → right with the digits. */
                           dir="ltr"
                           className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-navy-200 dark:bg-navy-800"
                        >
                           <motion.div
                              className="h-full rounded-full bg-linear-to-l from-brand-700 to-brand-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${(values.code.length / CODE_LENGTH) * 100}%` }}
                              transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 28 }}
                           />
                        </div>

                        {hasError && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{errors.code}</p>}
                        {error && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
                     </div>

                     <Button type="submit" disabled={!isComplete || busy} className="mt-6">
                        {busy ? fa.authPages.verifying : fa.authPages.verifySubmit}
                     </Button>
                  </>
               )
            }}
         </FormShell>

         <div className="mt-6 flex items-center justify-between gap-3 text-sm">
            <span className="text-navy-600 dark:text-navy-300">{fa.authPages.resendPrompt}</span>
            <button
               type="button"
               onClick={handleResend}
               disabled={isResending}
               className="rounded-full px-3 py-1 font-bold text-brand-700 transition-colors hover:bg-brand-500/10 hover:text-brand-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-300 dark:hover:bg-brand-500/15 dark:hover:text-brand-200"
            >
               {isResending ? fa.authPages.sending : fa.authPages.resend}
            </button>
         </div>

         <button
            type="button"
            onClick={handleBack}
            className="mt-4 text-sm font-medium text-navy-500 transition-colors hover:text-brand-700 dark:text-navy-400 dark:hover:text-brand-300"
         >
            {fa.authPages.backToLogin}
         </button>
      </motion.div>
   )
}
