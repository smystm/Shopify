"use client"

import { Formik, Form, type FormikHelpers, type FormikProps, type FormikValues } from "formik"
import * as Yup from "yup"
import type { ObjectSchema } from "yup"
import type { ReactNode } from "react"
import { UserIcon, PhoneIcon } from "@heroicons/react/24/outline"
import InputField from "../ui/InputField"
import Button from "../ui/Button"
import type { FormValues, AuthMode } from "../../contracts/auth/index"
import { fa } from "@/app/lib/i18n/fa"

export const authInitialValues: FormValues = {
   name: "",
   //email: "",
   //password: "",
   //confirmPassword: "",
   phone: "",
}

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/

const phoneField = Yup.string().required(fa.authPages.phoneRequired).matches(phoneRegExp, fa.authPages.phoneInvalid)

// Yup schemas — phone-based flow (must match the rendered fields only).
// Requiring a field that isn't rendered blocks submit silently, because
// Formik validation fails and onSubmit never fires.
const loginSchema = Yup.object({
   phone: phoneField,
   // --- Email/password flow (kept for later reuse) ---
   // email: Yup.string().email().required(),
   // password: Yup.string().min(8).required(),
})

const signupSchema = Yup.object({
   name: Yup.string().min(2, fa.authPages.nameMin).required(fa.authPages.nameRequired),
   phone: phoneField,
   //password: Yup.string()
   //   .min(8, fa.authPages.passwordMin)
   //   .matches(/[A-Z]/, fa.authPages.passwordUpper)
   //   .matches(/[0-9]/, fa.authPages.passwordNumber)
   //   .required(fa.authPages.passwordRequired),
   //confirmPassword: Yup.string()
   //   .oneOf([Yup.ref("password")], fa.authPages.passwordMismatch)
   //   .required(fa.authPages.confirmPasswordRequired),
})

interface FormBaseProps {
   mode: AuthMode
   initialValues?: FormValues
   onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void | Promise<void>
}

// Generic Formik shell shared by all forms (auth, verify, ...).
// It only owns the <Formik><Form> boilerplate — fields stay custom per form.
interface FormShellProps<T extends FormikValues> {
   initialValues: T
   validationSchema?: ObjectSchema<Record<string, unknown>>
   onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>
   children: (bag: FormikProps<T>) => ReactNode
   className?: string
   validateOnBlur?: boolean
   validateOnChange?: boolean
}

export function FormShell<T extends FormikValues>({
   initialValues,
   validationSchema,
   onSubmit,
   children,
   className = "flex flex-col gap-4",
   validateOnBlur = true,
   validateOnChange = true,
}: FormShellProps<T>) {
   return (
      <Formik
         initialValues={initialValues}
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         validationSchema={validationSchema as any}
         onSubmit={onSubmit}
         validateOnBlur={validateOnBlur}
         validateOnChange={validateOnChange}
      >
         {(bag) => (
            <Form className={className} noValidate>
               {children(bag)}
            </Form>
         )}
      </Formik>
   )
}

export default function FormBase({ mode, initialValues = authInitialValues, onSubmit }: FormBaseProps) {
   const isSignup = mode === "signup"

   return (
      <FormShell<FormValues> initialValues={initialValues} validationSchema={isSignup ? signupSchema : loginSchema} onSubmit={onSubmit}>
         {({ isSubmitting, touched, errors }) => (
            <>
               {isSignup && (
                  <InputField
                     name="name"
                     label={fa.authPages.name}
                     type="text"
                     placeholder={fa.authPages.namePlaceholder}
                     touched={touched.name}
                     error={errors.name}
                     autoComplete="name"
                     icon={<UserIcon className="h-5 w-5" aria-hidden="true" />}
                  />
               )}

               <InputField
                  name="phone"
                  label={fa.authPages.phone}
                  type="tel"
                  placeholder={fa.authPages.phonePlaceholder}
                  touched={touched.phone}
                  error={errors.phone}
                  autoComplete="tel"
                  icon={<PhoneIcon className="h-5 w-5" aria-hidden="true" />}
               />

               {/* <InputField name="email" label={fa.authPages.email} type="email" placeholder={fa.authPages.emailPlaceholder} touched={touched.email} error={errors.email} autoComplete="email" /> */}

               {/* <InputField
                  name="password"
                  label={fa.authPages.password}
                  type="password"
                  placeholder={fa.authPages.passwordPlaceholder}
                  touched={touched.password}
                  error={errors.password}
                  autoComplete={isSignup ? "new-password" : "current-password"}
               /> */}

               {/* {isSignup && (
                  <InputField
                     name="confirmPassword"
                     label={fa.authPages.confirmPassword}
                     type="password"
                     placeholder={fa.authPages.passwordPlaceholder}
                     touched={touched.confirmPassword}
                     error={errors.confirmPassword}
                     autoComplete="new-password"
                  />
               )} */}

               <Button type="submit" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? fa.authPages.pleaseWait : isSignup ? fa.authPages.submitSignup : fa.authPages.submitLogin}
               </Button>
            </>
         )}
      </FormShell>
   )
}
