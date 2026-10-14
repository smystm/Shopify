"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import { motion, useReducedMotion } from "motion/react"
import {
   CheckCircleIcon,
   ExclamationTriangleIcon,
   PhoneIcon,
   UserIcon,
   EnvelopeIcon,
   IdentificationIcon,
   LinkIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline"
import type { EditableProfile, PanelProfile } from "@/app/contracts/panel"
import { getProfile, updateProfile } from "@/app/helpers/panelApi"
import { removeLoginAuth } from "@/app/helpers/auth"
import { loginSuccess, logout } from "@/app/lib/store/authSlice"
import Button from "@/app/components/ui/Button"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

type SaveState = "idle" | "saving" | "saved" | "error"

function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

export default function ProfileClient() {
   const router = useRouter()
   const dispatch = useDispatch()
   const prefersReduced = useReducedMotion()
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])

   const [profile, setProfile] = useState<PanelProfile | null>(null)
   const [loading, setLoading] = useState(true)

   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [steamId, setSteamId] = useState("")
   const [tradeUrl, setTradeUrl] = useState("")

   const [state, setState] = useState<SaveState>("idle")

   useEffect(() => {
      let cancelled = false

      getProfile()
         .then((data) => {
            if (cancelled) return
            setProfile(data)
            setName(data?.name ?? "")
            setEmail(data?.email ?? "")
            setSteamId(data?.steam_id ?? "")
            setTradeUrl(data?.trade_url ?? "")
         })
         .catch(() => {})
         .finally(() => {
            if (!cancelled) setLoading(false)
         })

      return () => {
         cancelled = true
      }
   }, [])

   const steamComplete = Boolean(steamId.trim() && tradeUrl.trim())

   const handleSave = async () => {
      const patch: EditableProfile = {
         name: name.trim(),
         email: email.trim(),
         steam_id: steamId.trim(),
         trade_url: tradeUrl.trim(),
      }

      setState("saving")
      try {
         const updated = await updateProfile(patch)
         if (updated) {
            setProfile(updated)
            // Keep the header's user menu in sync with the new name.
            dispatch(
               loginSuccess({
                  id: updated.id,
                  name: updated.name ?? undefined,
                  phone: updated.phone ?? undefined,
                  permission: updated.permission ?? null,
               })
            )
         }
         setState("saved")
      } catch {
         setState("error")
      }
   }

   const handleLogout = async () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      await removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   if (loading) {
      return (
         <div className="space-y-4">
            <div className="h-9 w-48 animate-pulse rounded-xl bg-navy-200 dark:bg-navy-800" />
            <div className="h-4 w-72 animate-pulse rounded bg-navy-200 dark:bg-navy-800" />
            <div className="h-64 animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
         </div>
      )
   }

   return (
      <div className="max-w-3xl">
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{fa.panel.profileEdit.title}</h1>
            <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{fa.panel.profileEdit.subtitle}</p>
         </Reveal>

         {/* Steam readiness — a skin cannot be delivered without this. */}
         <Reveal delay={0.06}>
            <div
               className={[
                  "mt-6 flex items-start gap-3 rounded-2xl border p-4",
                  steamComplete
                     ? "border-emerald-600/25 bg-emerald-600/10"
                     : "border-accent-500/30 bg-accent-500/10",
               ].join(" ")}
            >
               <span
                  className={[
                     "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                     steamComplete ? "bg-emerald-700 text-white" : "bg-accent-700 text-white",
                  ].join(" ")}
               >
                  {steamComplete ? (
                     <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                     <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
                  )}
               </span>
               <p
                  className={[
                     "text-sm font-medium leading-6",
                     steamComplete ? "text-emerald-900 dark:text-emerald-200" : "text-accent-900 dark:text-accent-200",
                  ].join(" ")}
               >
                  {steamComplete ? fa.panel.profileEdit.steamReady : fa.panel.profileEdit.steamMissing}
               </p>
            </div>
         </Reveal>

         {/* Editable fields */}
         <Reveal delay={0.12}>
            <div className="mt-6 space-y-5 rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5">
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Row
                     icon={<UserIcon className="h-5 w-5" aria-hidden="true" />}
                     label={fa.panel.profileEdit.name}
                  >
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={fa.panel.profileEdit.namePlaceholder}
                        className={inputClass}
                     />
                  </Row>

                  <Row icon={<EnvelopeIcon className="h-5 w-5" aria-hidden="true" />} label={fa.panel.profileEdit.email}>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={fa.panel.profileEdit.emailPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>

                  <Row
                     icon={<IdentificationIcon className="h-5 w-5" aria-hidden="true" />}
                     label={fa.panel.profileEdit.steamId}
                  >
                     <input
                        type="text"
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        placeholder={fa.panel.profileEdit.steamIdPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>

                  <Row icon={<LinkIcon className="h-5 w-5" aria-hidden="true" />} label={fa.panel.profileEdit.tradeUrl}>
                     <input
                        type="url"
                        value={tradeUrl}
                        onChange={(e) => setTradeUrl(e.target.value)}
                        placeholder={fa.panel.profileEdit.tradeUrlPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>
               </div>

               {/* Phone is the login identity — changing it needs re-verification. */}
               <div className="border-t border-border-subtle pt-5">
                  <Row icon={<PhoneIcon className="h-5 w-5" aria-hidden="true" />} label={fa.panel.profile.phone}>
                     <input
                        type="tel"
                        value={profile?.phone ?? ""}
                        readOnly
                        dir="ltr"
                        aria-readonly="true"
                        className={`${inputClass} cursor-not-allowed opacity-70`}
                     />
                  </Row>
               </div>

               <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle pt-5">
                  <Button onClick={handleSave} disabled={state === "saving"} className="w-auto">
                     {state === "saving" ? fa.panel.profileEdit.saving : fa.panel.profileEdit.save}
                  </Button>

                  {state === "saved" ? (
                     <motion.span
                        initial={{ opacity: 0, x: prefersReduced ? 0 : -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300"
                     >
                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                        {fa.panel.profileEdit.saved}
                     </motion.span>
                  ) : null}

                  {state === "error" ? (
                     <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 dark:text-red-300">
                        <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
                        {fa.panel.profileEdit.failed}
                     </span>
                  ) : null}

                  <span className="ms-auto text-sm text-navy-500 dark:text-navy-400">
                     {fa.panel.profileEdit.memberSince}: {formatDate(profile?.created_at ?? null)}
                  </span>
               </div>
            </div>
         </Reveal>

         <Reveal delay={0.18}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
               <Button onClick={handleLogout} className="w-auto">
                  {fa.authPages.logout}
               </Button>
               <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-900 dark:hover:text-brand-300"
               >
                  <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                  {fa.panel.profileEdit.refresh}
               </button>
            </div>
         </Reveal>
      </div>
   )
}

const inputClass =
   "w-full rounded-xl border border-navy-300 bg-surface px-4 py-3 text-sm text-navy-950 outline-none transition-all duration-200 placeholder:text-navy-500 hover:border-brand-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder:text-navy-400"

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
   return (
      <div>
         <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-navy-800 dark:text-navy-200">
            <span className="text-navy-500 dark:text-navy-400">{icon}</span>
            {label}
         </label>
         {children}
      </div>
   )
}