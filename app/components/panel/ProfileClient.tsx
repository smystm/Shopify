"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useCookies } from "react-cookie"
import { motion, useReducedMotion } from "motion/react"
import { useSWRConfig } from "swr"
import {
   CheckCircleIcon,
   ExclamationTriangleIcon,
   PhoneIcon,
   UserIcon,
   IdentificationIcon,
   ArrowPathIcon,
   ArrowLeftOnRectangleIcon,
   PencilSquareIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline"
import type { EditableProfile, PanelProfile } from "@/app/contracts/panel"
import { getProfile, updateProfile, requestPhoneChange, confirmPhoneChange } from "@/app/helpers/panelApi"
import { STEAM_LINK_URL } from "@/app/helpers/authApi"
import { removeLoginAuth, storeLoginUser } from "@/app/helpers/auth"
import { loginSuccess, logout } from "@/app/lib/store/authSlice"
import Button from "@/app/components/ui/Button"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

type SaveState = "idle" | "saving" | "saved" | "error"
type PhoneStep = "idle" | "phone" | "code"

/** Sections that can be saved independently of one another. */
type BoxId = "identity" | "steam"

function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

/**
 * The backend keeps developer-facing errors in English by design, so map the
 * handful we can hit here onto Persian copy instead of leaking them through.
 */
function phoneErrorText(message: string): string {
   const m = message.toLowerCase()
   if (m.includes("already registered")) return fa.panel.profileEdit.phoneInUse
   if (m.includes("already your phone")) return fa.panel.profileEdit.phoneSame
   if (m.includes("not valid")) return fa.panel.profileEdit.phoneInvalid
   // A dropped connection is not a wrong code. Without this branch any 5xx or
   // network error fell through to "code is wrong", which sent people hunting
   // for a new code that was never the problem.
   if (m.includes("upstream_unreachable") || /failed with 5\d\d/.test(m) || m.includes("failed to fetch"))
      return fa.panel.profileEdit.networkError
   return fa.panel.profileEdit.phoneCodeWrong
}

export default function ProfileClient() {
   const router = useRouter()
   const dispatch = useDispatch()
   const { mutate } = useSWRConfig()
   const prefersReduced = useReducedMotion()
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])

   const [profile, setProfile] = useState<PanelProfile | null>(null)
   const [loading, setLoading] = useState(true)

   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [steamId, setSteamId] = useState("")
   const [tradeUrl, setTradeUrl] = useState("")

   // One save state per section, so each box reports its own progress.
   const [boxState, setBoxState] = useState<Record<BoxId, SaveState>>({ identity: "idle", steam: "idle" })

   // Phone change runs as its own verified flow, deliberately separate from any
   // section save — confirming a number is a different operation.
   const [phoneStep, setPhoneStep] = useState<PhoneStep>("idle")
   const [newPhone, setNewPhone] = useState("")
   const [phoneCode, setPhoneCode] = useState("")
   const [verificationId, setVerificationId] = useState<string | null>(null)
   const [phoneBusy, setPhoneBusy] = useState(false)
   const [phoneMsg, setPhoneMsg] = useState<{ ok: boolean; text: string } | null>(null)

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

   // Only the keys a section actually owns are ever sent, so saving the name can
   // never blank the Steam fields and the two boxes never overwrite each other.
   const identityDirty = name.trim() !== (profile?.name ?? "").trim() || email.trim() !== (profile?.email ?? "").trim()
   const steamDirty = steamId.trim() !== (profile?.steam_id ?? "").trim() || tradeUrl.trim() !== (profile?.trade_url ?? "").trim()

   // Mirrors the server's rules so the button is disabled rather than 422ing.
   const nameValid = name.trim().length >= 2
   const emailValid = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
   // Mirrors the server's pattern: the real link is /tradeoffer/new/?partner=…&token=…
   const tradeUrlValid =
      tradeUrl.trim() === "" ||
      /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/?\?partner=\d{5,12}&token=[A-Za-z0-9_-]{4,32}\/?$/i.test(tradeUrl.trim())
   const steamIdValid = steamId.trim().length <= 40

   /**
 * Propagates a profile change everywhere it is displayed.
 *
 * Three separate stores hold the user, and all three need updating:
 *  1. this component's form state,
 *  2. Redux — the header's UserMenu reads it,
 *  3. the `shopy-user` cookie — /panel and /admin are server components that
 *     read the cookie, so without this they keep showing the old name until a
 *     full page load.
 *
 * `router.refresh()` then re-runs the current route's server components so they
 * re-read that cookie, and mutating the SWR key revalidates useAuth, which caches
 * the same user for the admin shell. This component's own state survives both.
 */
const applyProfile = (updated: PanelProfile) => {
      setProfile(updated)
      setName(updated.name ?? "")
      setEmail(updated.email ?? "")
      setSteamId(updated.steam_id ?? "")
      setTradeUrl(updated.trade_url ?? "")

      const nextUser = {
         id: updated.id,
         name: updated.name ?? undefined,
         // email is included so UserMenu keeps preferring it for its detail
         // line instead of silently falling back to the phone number.
         email: updated.email ?? undefined,
         phone: updated.phone ?? undefined,
         // Carried so the header picks up a Steam picture the moment the profile
         // knows about one, without waiting for the next revalidation.
         avatar: updated.avatar ?? null,
         permission: updated.permission ?? null,
      }

      storeLoginUser(nextUser)
      dispatch(loginSuccess(nextUser))
      // Fire-and-forget: a failed revalidation must not fail the save, and
      // useAuth falls back to the cookie-hydrated Redux user anyway.
      void mutate("user_me")
      router.refresh()
   }

   const setBox = (box: BoxId, next: SaveState) => setBoxState((prev) => ({ ...prev, [box]: next }))

   const saveBox = async (box: BoxId) => {
      // An empty string clears the field; the server turns it into NULL.
      const patch: EditableProfile =
         box === "identity" ? { name: name.trim(), email: email.trim() } : { steam_id: steamId.trim(), trade_url: tradeUrl.trim() }

      setBox(box, "saving")
      try {
         const updated = await updateProfile(patch)
         if (updated) applyProfile(updated)
         setBox(box, "saved")
      } catch {
         setBox(box, "error")
      }
   }

   // Clearing the "saved" flash the moment the user edits again keeps the
   // message honest instead of claiming unsaved changes are stored.
   const resetBoxState = (box: BoxId) => setBoxState((prev) => (prev[box] === "error" ? prev : { ...prev, [box]: "idle" }))

   const resetPhoneFlow = () => {
      setPhoneStep("idle")
      setNewPhone("")
      setPhoneCode("")
      setVerificationId(null)
      setPhoneMsg(null)
   }

   const sendCode = async () => {
      setPhoneBusy(true)
      setPhoneMsg(null)
      try {
         const res = await requestPhoneChange(newPhone.trim())
         setVerificationId(res.verificationId)
         // The endpoint never returns the code — it was sent to the new number,
         // so the user types it in. Matches the login flow exactly.
         setPhoneCode("")
         setPhoneStep("code")
         setPhoneMsg({ ok: true, text: fa.panel.profileEdit.phoneCodeSent })
      } catch (err) {
         setPhoneMsg({ ok: false, text: phoneErrorText(err instanceof Error ? err.message : "") })
      } finally {
         setPhoneBusy(false)
      }
   }

   const submitCode = async () => {
      if (!verificationId) return
      setPhoneBusy(true)
      setPhoneMsg(null)
      try {
         const updated = await confirmPhoneChange(verificationId, phoneCode.trim())
         if (updated) applyProfile(updated)
         setPhoneMsg({ ok: true, text: fa.panel.profileEdit.phoneChanged })
         // Collapse back to the read-only view after a moment.
         setTimeout(resetPhoneFlow, 1600)
      } catch (err) {
         setPhoneMsg({ ok: false, text: phoneErrorText(err instanceof Error ? err.message : "") })
      } finally {
         setPhoneBusy(false)
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
               ))}
            </div>
         </div>
      )
   }

   return (
      <div className="max-w-6xl">
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{fa.panel.profileEdit.title}</h1>
            <p className="mt-1.5 text-sm leading-6 text-navy-600 dark:text-navy-300">{fa.panel.profileEdit.subtitle}</p>
         </Reveal>

         {/* ---------- Three independent sections ---------- */}
         <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.06} className="h-full">
               <Box title={fa.panel.profileEdit.identityTitle} icon={<UserIcon className="h-4 w-4" aria-hidden="true" />}>
                  <Row label={fa.panel.profileEdit.name} invalid={name.trim().length > 0 && !nameValid}>
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                           setName(e.target.value)
                           resetBoxState("identity")
                        }}
                        placeholder={fa.panel.profileEdit.namePlaceholder}
                        className={inputClass}
                     />
                  </Row>

                  <Row label={fa.panel.profileEdit.email} hint={fa.panel.profileEdit.emailHint} invalid={!emailValid}>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value)
                           resetBoxState("identity")
                        }}
                        placeholder={fa.panel.profileEdit.emailPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>

                  <SectionSave
                     label={fa.panel.profileEdit.identitySave}
                     state={boxState.identity}
                     disabled={!identityDirty || !nameValid || !emailValid}
                     onSave={() => saveBox("identity")}
                  />
               </Box>
            </Reveal>

            <Reveal delay={0.12} className="h-full">
               <Box title={fa.panel.profileEdit.steamTitle} icon={<IdentificationIcon className="h-4 w-4" aria-hidden="true" />}>
                  {/* Readiness lives inside the box it refers to. */}
                  <div
                     className={[
                        "flex items-center gap-2 rounded-xl border px-3 py-2",
                        steamComplete
                           ? "border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-200"
                           : "border-accent-500/30 bg-accent-500/10 text-accent-900 dark:text-accent-200",
                     ].join(" ")}
                  >
                     <span
                        className={[
                           "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white",
                           steamComplete ? "bg-emerald-700" : "bg-accent-700",
                        ].join(" ")}
                     >
                        {steamComplete ? (
                           <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                           <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                     </span>
                     <span className="text-xs font-bold leading-5">
                        {steamComplete ? fa.panel.profileEdit.steamReady : fa.panel.profileEdit.steamMissing}
                     </span>
                  </div>

                  <Row label={fa.panel.profileEdit.steamId}>
                     <input
                        type="text"
                        value={steamId}
                        onChange={(e) => {
                           setSteamId(e.target.value)
                           resetBoxState("steam")
                        }}
                        placeholder={fa.panel.profileEdit.steamIdPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>

                  <Row label={fa.panel.profileEdit.tradeUrl} hint={fa.panel.profileEdit.tradeUrlHint} invalid={!tradeUrlValid}>
                     <input
                        type="url"
                        value={tradeUrl}
                        onChange={(e) => {
                           setTradeUrl(e.target.value)
                           resetBoxState("steam")
                        }}
                        placeholder={fa.panel.profileEdit.tradeUrlPlaceholder}
                        dir="ltr"
                        className={inputClass}
                     />
                  </Row>

                  <SectionSave
                     label={fa.panel.profileEdit.steamSave}
                     state={boxState.steam}
                     disabled={!steamDirty || !tradeUrlValid || !steamIdValid}
                     onSave={() => saveBox("steam")}
                  />
               </Box>
            </Reveal>

            <Reveal delay={0.18} className="h-full">
               <Box title={fa.panel.profileEdit.phoneTitle} icon={<PhoneIcon className="h-4 w-4" aria-hidden="true" />}>
                  {/* Idle: current number, read-only. */}
                  {phoneStep === "idle" ? (
                     <>
                        <div className="rounded-xl border border-border-subtle bg-surface-muted/60 px-4 py-3">
                           <span className="block text-xs font-medium text-navy-500 dark:text-navy-400">
                              {fa.panel.profileEdit.phoneFixedHint}
                           </span>
                           <span dir="ltr" className="mt-0.5 block text-base font-extrabold text-navy-950 dark:text-white">
                              {profile?.phone ?? fa.panel.profile.unknown}
                           </span>
                        </div>

                        <button
                           type="button"
                           onClick={() => {
                              setPhoneStep("phone")
                              setPhoneMsg(null)
                           }}
                           className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-400/40 bg-brand-500/10 px-4 py-2.5 text-sm font-bold text-brand-700 transition-all duration-300 hover:border-brand-500 hover:bg-brand-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-300"
                        >
                           <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                           {fa.panel.profileEdit.phoneChange}
                        </button>
                     </>
                  ) : null}

                  {/* Step 1: the new number. */}
                  {phoneStep === "phone" ? (
                     <>
                        <Row label={fa.panel.profileEdit.phoneNew}>
                           <input
                              type="tel"
                              inputMode="numeric"
                              value={newPhone}
                              onChange={(e) => setNewPhone(e.target.value)}
                              placeholder={fa.panel.profileEdit.phoneNewPlaceholder}
                              dir="ltr"
                              className={inputClass}
                           />
                        </Row>

                        <div className="mt-1 flex gap-2">
                           <Button onClick={sendCode} disabled={phoneBusy || newPhone.trim().length < 10} fullWidth={false} className="flex-1">
                              {phoneBusy ? fa.panel.profileEdit.phoneSendingCode : fa.panel.profileEdit.phoneSendCode}
                           </Button>
                           <CancelButton onClick={resetPhoneFlow} />
                        </div>
                     </>
                  ) : null}

                  {/* Step 2: the code. */}
                  {phoneStep === "code" ? (
                     <>
                        <Row label={fa.panel.profileEdit.phoneCode}>
                           <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={phoneCode}
                              onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder={fa.panel.profileEdit.phoneCodePlaceholder}
                              dir="ltr"
                              className={`${inputClass} text-center text-lg font-extrabold tracking-[0.3em]`}
                           />
                        </Row>

                        <div className="mt-1 flex gap-2">
                           <Button onClick={submitCode} disabled={phoneBusy || phoneCode.trim().length !== 6} fullWidth={false} className="flex-1">
                              {fa.panel.profileEdit.phoneConfirm}
                           </Button>
                           <CancelButton onClick={resetPhoneFlow} />
                        </div>
                     </>
                  ) : null}

                  {phoneMsg ? (
                     <motion.p
                        initial={{ opacity: 0, y: prefersReduced ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={[
                           "flex items-start gap-1.5 text-xs font-bold leading-5",
                           phoneMsg.ok ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300",
                        ].join(" ")}
                     >
                        {phoneMsg.ok ? (
                           <CheckCircleIcon className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                        ) : (
                           <ExclamationTriangleIcon className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                        {phoneMsg.text}
                     </motion.p>
                  ) : null}
               </Box>
            </Reveal>

            {/* ---------- Steam link ----------
                The way an account that already exists - orders, balance, history -
                reaches Steam sign-in without becoming a second customer.

                It is only offered where it is both needed and possible: an account
                that has a verified phone (that is what makes the link safe) and no
                Steam identity yet. Once linked, the panel shows the result instead
                of another button, so there is no state where somebody can press it
                twice. */}
            {profile?.phone && !profile?.steam_id ? (
               <Reveal delay={0.2}>
                  <div className="mt-5 rounded-2xl border border-border-strong bg-surface px-5 py-4 shadow-md shadow-navy-900/5">
                     <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0">
                           <p className="text-sm font-bold text-navy-950 dark:text-white">{fa.panel.profileEdit.steamLinkTitle}</p>
                           <p className="mt-1 max-w-xl text-xs leading-6 text-navy-600 dark:text-navy-300">
                              {fa.panel.profileEdit.steamLinkBody}
                           </p>
                        </div>

                        <a
                           href={STEAM_LINK_URL}
                           className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1b2838] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a475e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                           <ArrowLeftOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                           {fa.authPages.steam.linkCta}
                        </a>
                     </div>
                  </div>
               </Reveal>
            ) : null}
         </div>

         {/* ---------- Account-level actions, not section saves ---------- */}
         <Reveal delay={0.24}>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-border-strong bg-surface px-5 py-4 shadow-md shadow-navy-900/5">
               <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-navy-600 transition-colors hover:bg-navy-100 hover:text-brand-700 dark:text-navy-300 dark:hover:bg-navy-900 dark:hover:text-brand-300"
               >
                  <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                  {fa.panel.profileEdit.refresh}
               </button>

               <Button onClick={handleLogout} fullWidth={false} variant="toggle" isActive={false}>
                  {fa.authPages.logout}
               </Button>

               <span className="ms-auto text-sm text-navy-500 dark:text-navy-400">
                  {fa.panel.profileEdit.memberSince}: {formatDate(profile?.created_at ?? null)}
               </span>
            </div>
         </Reveal>
      </div>
   )
}

/* ------------------------------------------------------------------ pieces */

const inputClass =
   "w-full rounded-xl border border-navy-300 bg-surface px-4 py-2.5 text-sm text-navy-950 outline-none transition-all duration-200 placeholder:text-navy-500 hover:border-brand-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder:text-navy-400"

function Box({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
   return (
      <section className="flex h-full flex-col gap-4 rounded-2xl border border-border-strong bg-surface p-5 shadow-md shadow-navy-900/5">
         <h2 className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
            <span className="text-navy-500 dark:text-navy-400">{icon}</span>
            {title}
         </h2>
         {children}
      </section>
   )
}

function Row({ label, hint, invalid, children }: { label: string; hint?: string; invalid?: boolean; children: React.ReactNode }) {
   return (
      <div>
         <label className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold text-navy-700 dark:text-navy-300">
            <span>{label}</span>
            {hint ? <span className="text-[11px] font-medium text-navy-500 dark:text-navy-400">{hint}</span> : null}
         </label>
         {children}
         {invalid ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-300">
               <ExclamationTriangleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
               {fa.panel.profileEdit.invalidField}
            </p>
         ) : null}
      </div>
   )
}

/**
 * One section's save button. Sits inside its own box and reports only that
 * section's outcome, so a failure in one section is never confused with another.
 */
function SectionSave({
   label,
   state,
   disabled,
   onSave,
}: {
   label: string
   state: SaveState
   disabled: boolean
   onSave: () => void
}) {
   return (
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border-subtle pt-4">
         <Button onClick={onSave} disabled={disabled || state === "saving"} fullWidth={false}>
            {state === "saving" ? fa.panel.profileEdit.saving : label}
         </Button>

         {state === "saved" ? (
            <motion.span
               initial={{ opacity: 0, y: 4 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"
            >
               <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
               {fa.panel.profileEdit.saved}
            </motion.span>
         ) : null}

         {state === "error" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-300">
               <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
               {fa.panel.profileEdit.failed}
            </span>
         ) : null}
      </div>
   )
}

function CancelButton({ onClick }: { onClick: () => void }) {
   return (
      <button
         type="button"
         onClick={onClick}
         className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border-strong px-4 py-2.5 text-sm font-bold text-navy-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:text-navy-300 dark:hover:text-brand-300"
      >
         <XMarkIcon className="h-4 w-4" aria-hidden="true" />
         {fa.panel.profileEdit.phoneCancel}
      </button>
   )
}