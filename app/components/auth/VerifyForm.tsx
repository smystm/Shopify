"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
   "h-12 w-full rounded-lg border border-zinc-300 bg-white text-center text-lg font-medium text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white"

export default function VerifyForm({ phone, initialValues = verifyInitialValues, onVerify, onResend, isVerifying = false, isResending = false, error = null }: VerifyFormProps) {
   const router = useRouter()
   const inputsRef = useRef<Array<HTMLInputElement | null>>([])

   const dispatch = useAppDispatch()

   const token = useAppSelector(selectPhoneVerifyToken)

   const clearPhoneToken = () => {
      dispatch(updatePhoneVerifyToken(undefined))
   }

   useEffect(() => {
      if (token === undefined) router.push("/panel")
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
         console.log(res.data?.user?.token)
         clearPhoneToken()

          const verifiedUser = {
             id: res.data?.user?.id,
             name: res.data?.user?.name,
             email: res.data?.user?.email,
             phone: res.data?.user?.phone,
             // Keep the permission from the backend so the admin UI can gate actions.
             permission: res.data?.user?.permission,
          }

         storeLoginToken(res.data?.user?.token)
         storeLoginUser(verifiedUser)
         
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
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
         <h2 className="text-2xl font-semibold tracking-tight">{fa.authPages.verifyHeading}</h2>
         <p className="mb-6 mt-1 text-sm text-zinc-500">
            {phone ? (
               fa.authPages.verifySentTo.replace("{phone}", phone)
            ) : (
               fa.authPages.verifySentHint
            )}
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
                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                           {digits.map((digit, i) => (
                              <input
                                 key={i}
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
                                 className={`${otpInputClass} ${hasError ? "border-red-500" : ""}`}
                              />
                           ))}
                        </div>
                        {hasError && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                     </div>

                     <Button type="submit" disabled={!isComplete || busy} className="mt-2">
                        {busy ? fa.authPages.verifying : fa.authPages.verifySubmit}
                     </Button>
                  </>
               )
            }}
         </FormShell>

         <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-zinc-500">{fa.authPages.resendPrompt}</span>
            <button
               type="button"
               onClick={handleResend}
               disabled={isResending}
               className="font-medium text-black transition hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
            >
               {isResending ? fa.authPages.sending : fa.authPages.resend}
            </button>
         </div>

         <button type="button" onClick={handleBack} className="mt-4 text-sm text-zinc-500 transition hover:text-zinc-800 dark:hover:text-zinc-200">
            {fa.authPages.backToLogin}
         </button>
      </div>
   )
}
