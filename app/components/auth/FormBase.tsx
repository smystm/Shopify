"use client"

import { Formik, Form, type FormikHelpers, type FormikProps, type FormikValues } from "formik"
import * as Yup from "yup"
import type { ObjectSchema } from "yup"
import type { ReactNode } from "react"
import InputField from "../ui/InputField"
import Button from "../ui/Button"
import type { FormValues, AuthMode } from "../contracts/auth/index"

export const authInitialValues: FormValues = {
   name: "",
   //email: "",
   //password: "",
   //confirmPassword: "",
   phone: "",
}

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/

const phoneField = Yup.string().required("Phone number is required").matches(phoneRegExp, "Invalid phone number")

// Yup schemas — phone-based flow (must match the rendered fields only).
// Requiring a field that isn't rendered blocks submit silently, because
// Formik validation fails and onSubmit never fires.
const loginSchema = Yup.object({
   phone: phoneField,
   // --- Email/password flow (kept for later reuse) ---
   // email: Yup.string().email("Invalid email address").required("Email is required"),
   // password: Yup.string().min(8, "Min 8 characters").required("Password is required"),
})

const signupSchema = Yup.object({
   name: Yup.string().min(2, "Min 2 characters").required("Name is required"),
   phone: phoneField,
   //password: Yup.string()
   //   .min(8, "Min 8 characters")
   //   .matches(/[A-Z]/, "Need at least one uppercase letter")
   //   .matches(/[0-9]/, "Need at least one number")
   //   .required("Password is required"),
   //confirmPassword: Yup.string()
   //   .oneOf([Yup.ref("password")], "Passwords must match")
   //   .required("Please confirm your password"),
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
               {isSignup && <InputField name="name" label="Name" type="text" placeholder="John Doe" touched={touched.name} error={errors.name} autoComplete="name" />}

               <InputField name="phone" label="Phone" type="tel" placeholder="09123456789" touched={touched.phone} error={errors.phone} autoComplete="tel" />

               {/* <InputField name="email" label="Email" type="email" placeholder="you@example.com" touched={touched.email} error={errors.email} autoComplete="email" /> */}

               {/* <InputField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  touched={touched.password}
                  error={errors.password}
                  autoComplete={isSignup ? "new-password" : "current-password"}
               /> */}

               {/* {isSignup && (
                  <InputField
                     name="confirmPassword"
                     label="Confirm password"
                     type="password"
                     placeholder="••••••••"
                     touched={touched.confirmPassword}
                     error={errors.confirmPassword}
                     autoComplete="new-password"
                  />
               )} */}

               <Button type="submit" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
               </Button>
            </>
         )}
      </FormShell>
   )
}
