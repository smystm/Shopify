"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowLeftOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import type { AuthUser } from "@/app/lib/store/authSlice"
import type { AuthMode } from "@/app/helpers/authApi"
import { STEAM_LINK_URL, STEAM_LOGIN_URL } from "@/app/helpers/authApi"
import { fa } from "@/app/lib/i18n/fa"

interface SteamSignInProps {
   /** `link` is the panel flow: attach Steam to an account that already exists. */
   mode: AuthMode
   variant?: "signin" | "link"
   /** Present only in the link flow: who is about to gain a Steam login. */
   account?: AuthUser | null
}

/**
 * The Steam hand-off.
 *
 * There is no form here and that is not an omission. Steam proves identity and
 * the customer authorises on Steam's own page, so the only thing this component
 * can honestly do is explain that and get out of the way - anything resembling a
 * password box on this page would be a lie.
 *
 * When `AUTH_PROVIDER=steam`, this is what /login and /register both render: a
 * first-time visitor creates their account on the way back, an existing one is
 * signed straight in. There is nothing to choose between, which is why the two
 * buttons can stay in the header exactly as they are.
 */
export default function SteamSignIn({ mode, variant = "signin", account = null }: SteamSignInProps) {
   const prefersReduced = useReducedMotion()
   const copy = fa.authPages.steam
   const isLink = variant === "link"
   const href = isLink ? STEAM_LINK_URL : STEAM_LOGIN_URL

   if (!mode.ready) {
      return (
         <p className="rounded-2xl border border-accent-400/40 bg-accent-400/10 px-4 py-3 text-sm font-bold leading-6 text-accent-800 dark:text-accent-300" role="status">
            {copy.notReady}
         </p>
      )
   }

   return (
      <motion.div
         initial={prefersReduced ? false : { opacity: 0, y: 12 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.35 }}
         className="w-full max-w-md"
      >
         {isLink && account ? (
            <p className="mb-5 rounded-2xl border border-border-subtle bg-surface-muted px-4 py-3 text-center text-sm text-navy-600 dark:text-navy-300">
               {copy.linkIntro.replace("{name}", account.name ?? account.phone ?? "")}
            </p>
         ) : null}

         {/* A full-width Steam button, not a form with a submit. Steam's own
             colours, because this is a third-party authorisation and pretending
             otherwise confuses people about where they are typing what. */}
         <a
            href={href}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1b2838] px-6 py-4 text-base font-bold text-white shadow-lg shadow-navy-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a475e] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
         >
            {/* Steam's own dark blue, because this is a hand-off to a third party
                and styling it like our own form would hide where the customer is
                actually signing in. The icon is deliberately generic rather than
                Valve's mark - we link to them, we are not them. */}
            <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{isLink ? copy.linkCta : copy.signInCta}</span>
            <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 rtl:scale-x-[-1]" aria-hidden="true" />
         </a>

         <ul className="mt-6 space-y-2.5 text-sm leading-6 text-navy-600 dark:text-navy-300">
            {copy.points.map((point) => (
               <li key={point} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{point}</span>
               </li>
            ))}
         </ul>
      </motion.div>
   )
}