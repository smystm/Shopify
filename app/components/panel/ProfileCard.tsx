"use client"

import Link from "next/link"
import { PhoneIcon, UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { motion, useReducedMotion } from "motion/react"
import type { AuthUser } from "@/app/lib/store/authSlice"
import { fa } from "@/app/lib/i18n/fa"

interface ProfileCardProps {
   user: AuthUser | null
   permissionLabel?: string
}

/**
 * Identity summary for the panel overview.
 *
 * Deliberately not the full profile: editing lives on /panel/profile, and the
 * username/permission details that used to sit here are either visible in the
 * header or private. This is a "who am I" strip, so it links out instead.
 */
export default function ProfileCard({ user, permissionLabel }: ProfileCardProps) {
   const prefersReduced = useReducedMotion()

   const name = user?.name
   const phone = user?.phone

   return (
      <motion.section
         initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-80px" }}
         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
         className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-5 shadow-md shadow-navy-900/5"
      >
         <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-e-16 -top-16 h-48 w-48 rounded-full bg-brand-400/12 blur-3xl"
         />

         <div className="relative flex flex-wrap items-center gap-4">
            {/* Avatar initials — a decorative stand-in for a missing photo. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-l from-brand-700 to-brand-800 text-lg font-extrabold text-white shadow-lg shadow-brand-700/25">
               {name?.trim() ? name.trim().charAt(0) : <UserCircleIcon className="h-7 w-7" aria-hidden="true" />}
               <span className="sr-only">{name ?? fa.panel.profile.unknown}</span>
            </span>

            <div className="min-w-0">
               <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-bold text-navy-950 dark:text-white">
                     {name || fa.panel.profile.unknown}
                  </h2>

                  {permissionLabel ? (
                     <span className="rounded-full bg-brand-700/12 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                        {permissionLabel}
                     </span>
                  ) : null}
               </div>

               {/* Phone numbers read left-to-right even in the RTL page. */}
               <p
                  dir="ltr"
                  className={`mt-1 text-start text-sm font-medium ${phone ? "text-navy-600 dark:text-navy-300" : "text-navy-500 dark:text-navy-400"}`}
               >
                  {phone || fa.panel.profile.unknown}
               </p>
            </div>

            <div className="ms-auto flex items-center gap-2">
               {phone ? <PhoneIcon className="h-4 w-4 text-navy-400 dark:text-navy-500" aria-hidden="true" /> : null}

               <Link
                  href="/panel/profile"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-sm font-bold text-brand-700 transition-all duration-300 hover:border-brand-500 hover:bg-brand-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-300"
               >
                  <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                  {fa.panel.summary.editProfile}
               </Link>
            </div>
         </div>
      </motion.section>
   )
}