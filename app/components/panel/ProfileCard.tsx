"use client"

import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import { ArrowPathIcon, PhoneIcon, UserIcon, FingerPrintIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import type { AuthUser } from "@/app/lib/store/authSlice"
import { logout } from "@/app/lib/store/authSlice"
import { removeLoginAuth } from "@/app/helpers/auth"
import Button from "@/app/components/ui/Button"
import { fa } from "@/app/lib/i18n/fa"

interface ProfileCardProps {
   user: AuthUser | null
   permissionLabel?: string
}

interface FieldProps {
   icon: React.ReactNode
   label: string
   value: string
   /** Values that came back empty from the backend. */
   missing?: boolean
}

function Field({ icon, label, value, missing }: FieldProps) {
   return (
      <div className="flex items-center gap-3.5 rounded-xl border border-border-subtle bg-surface-muted/60 px-4 py-3">
         <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-700 dark:text-brand-300">
            {icon}
         </span>
         <span className="min-w-0">
            <span className="block text-xs font-medium text-navy-500 dark:text-navy-400">{label}</span>
            <span
               className={`block truncate text-sm font-bold ${missing ? "text-navy-500 dark:text-navy-400" : "text-navy-950 dark:text-white"}`}
               dir={label === fa.panel.profile.phone ? "ltr" : undefined}
            >
               {value}
            </span>
         </span>
      </div>
   )
}

export default function ProfileCard({ user, permissionLabel }: ProfileCardProps) {
   const router = useRouter()
   const dispatch = useDispatch()
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])
   const prefersReduced = useReducedMotion()

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   const name = user?.name
   const phone = user?.phone
   const unknown = fa.panel.profile.unknown

   return (
      <motion.section
         initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-80px" }}
         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
         className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5"
      >
         <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-e-16 -top-16 h-48 w-48 rounded-full bg-brand-400/12 blur-3xl"
         />

         <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
               <h2 className="text-lg font-bold text-navy-950 dark:text-white">{fa.panel.profile.title}</h2>
               <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{fa.panel.profile.subtitle}</p>
            </div>
            <Button onClick={handleLogout}>{fa.authPages.logout}</Button>
         </div>

         <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field icon={<UserIcon className="h-5 w-5" aria-hidden="true" />} label={fa.panel.profile.name} value={name || unknown} missing={!name} />

            {/* Phone numbers read left-to-right even in the RTL form. */}
            <Field icon={<PhoneIcon className="h-5 w-5" aria-hidden="true" />} label={fa.panel.profile.phone} value={phone || unknown} missing={!phone} />

            <Field
               icon={<FingerPrintIcon className="h-5 w-5" aria-hidden="true" />}
               label={fa.panel.profile.userId}
               value={user?.id !== undefined ? `#${user.id}` : unknown}
               missing={user?.id === undefined}
            />

            <Field
               icon={<ArrowPathIcon className="h-5 w-5" aria-hidden="true" />}
               label={fa.panel.profile.permission}
               value={permissionLabel || unknown}
               missing={!permissionLabel}
            />
         </div>
      </motion.section>
   )
}