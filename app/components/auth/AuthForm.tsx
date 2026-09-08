"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import InputField from "../ui/InputField"
import Button from "../ui/Button"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks"
import { setMode, loginSuccess, logout } from "../../lib/store/authSlice"

export type AuthMode = "login" | "signup"

interface FormValues {
   name: string
   email: string
   password: string
   confirmPassword: string
}

const initialValues: FormValues = {
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
}

// Yup schemas — shared base + mode-specific rules
const loginSchema = Yup.object({
   email: Yup.string().email("Invalid email address").required("Email is required"),
   password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
})

const signupSchema = loginSchema.shape({
   name: Yup.string().min(2, "Min 2 characters").required("Name is required"),
   password: Yup.string().min(6, "Min 6 characters").matches(/[A-Z]/, "Need at least one uppercase letter").matches(/[0-9]/, "Need at least one number").required("Password is required"),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
})

export default function AuthForm({ mode }: { mode: AuthMode }) {
   const dispatch = useAppDispatch()
   const router = useRouter()
   const user = useAppSelector((s) => s.auth.user)

   const isSignup = mode === "signup"

   // Keep redux mode in sync with the current route
   useEffect(() => {
      dispatch(setMode(isSignup ? "signup" : "login"))
   }, [dispatch, isSignup])

   if (user) {
      return (
         <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold">Welcome, {user.name || user.email}! 🎉</h2>
            <p className="mt-2 text-sm text-zinc-500">You are logged in as {user.email}</p>
            <Button onClick={() => dispatch(logout())} className="mt-6">
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

         <Formik
            key={mode} // reset form when switching modes
            initialValues={initialValues}
            validationSchema={isSignup ? signupSchema : loginSchema}
            onSubmit={(values, { setSubmitting }) => {
               console.log("Form submitted:", values)
               // Simulate API call — replace with real fetch/SWR later
               setTimeout(() => {
                  dispatch(
                     loginSuccess({
                        email: values.email,
                        name: isSignup ? values.name : undefined,
                     })
                  )
                  setSubmitting(false)
               }, 800)
            }}
         >
            {({ isSubmitting, touched, errors }) => (
               <Form className="flex flex-col gap-4" noValidate>
                  {isSignup && <InputField name="name" label="Name" type="text" placeholder="John Doe" touched={touched.name} error={errors.name} autoComplete="name" />}

                  <InputField name="email" label="Email" type="email" placeholder="you@example.com" touched={touched.email} error={errors.email} autoComplete="email" />

                  <InputField
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="••••••••"
                     touched={touched.password}
                     error={errors.password}
                     autoComplete={isSignup ? "new-password" : "current-password"}
                  />

                  {isSignup && (
                     <InputField
                        name="confirmPassword"
                        label="Confirm password"
                        type="password"
                        placeholder="••••••••"
                        touched={touched.confirmPassword}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                     />
                  )}

                  <Button type="submit" disabled={isSubmitting} className="mt-2">
                     {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
                  </Button>
               </Form>
            )}
         </Formik>
      </div>
   )
}
