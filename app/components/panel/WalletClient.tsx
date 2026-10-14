"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { WalletIcon, ArrowDownIcon, ArrowUpIcon, CreditCardIcon } from "@heroicons/react/24/outline"
import type { WalletTransaction } from "@/app/contracts/panel"
import { getWallet, topUpWallet } from "@/app/helpers/panelApi"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import Button from "@/app/components/ui/Button"
import { fa } from "@/app/lib/i18n/fa"

function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

const AMOUNT_CLASS =
   "w-full rounded-xl border border-navy-300 bg-surface px-4 py-3 text-sm text-navy-950 outline-none transition-all duration-200 placeholder:text-navy-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder:text-navy-400"

export default function WalletClient() {
   const prefersReduced = useReducedMotion()
   const [balance, setBalance] = useState<number | null>(null)
   const [transactions, setTransactions] = useState<WalletTransaction[]>([])
   const [loading, setLoading] = useState(true)

   const [amount, setAmount] = useState("")
   const [busy, setBusy] = useState(false)
   const [hint, setHint] = useState<string | null>(null)

   useEffect(() => {
      let cancelled = false

      getWallet()
         .then((res) => {
            if (cancelled) return
            setBalance(res.balance)
            setTransactions(res.transactions)
         })
         .catch(() => {})
         .finally(() => {
            if (!cancelled) setLoading(false)
         })

      return () => {
         cancelled = true
      }
   }, [])

   const handleTopUp = async () => {
      const value = Number(amount)
      if (!Number.isFinite(value) || value <= 0) return

      setBusy(true)
      setHint(null)
      try {
         const res = await topUpWallet(value, "panel-demo")
         setBalance(res.balance)
         setTransactions(res.transactions)
         setAmount("")
         setHint(fa.panel.wallet.topupDone)
      } catch {
         setHint(fa.panel.profileEdit.failed)
      } finally {
         setBusy(false)
      }
   }

   if (loading) {
      return (
         <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
            <div className="h-64 animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
         </div>
      )
   }

   return (
      <div>
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{fa.panel.wallet.title}</h1>
            <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{fa.panel.wallet.subtitle}</p>
         </Reveal>

         {/* Balance + top-up */}
         <Reveal delay={0.08}>
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
               <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-linear-to-bl from-brand-700 to-brand-800 p-6 shadow-xl shadow-brand-700/20 lg:col-span-3">
                  <span
                     aria-hidden="true"
                     className="pointer-events-none absolute -inset-e-16 -top-16 h-40 w-40 rounded-full bg-brand-400/25 blur-3xl"
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                     <WalletIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="relative mt-4 text-sm font-bold text-brand-100">{fa.panel.wallet.balance}</p>
                  {/* White on brand-700/800 passes at 5.47 / 7.58. */}
                  <p className="relative mt-1 text-3xl font-extrabold text-white" dir="ltr">
                     ${(balance ?? 0).toLocaleString("en-US")}
                  </p>
               </div>

               <div className="rounded-2xl border border-border-strong bg-surface p-6 shadow-md shadow-navy-900/5 lg:col-span-2">
                  <h2 className="text-base font-bold text-navy-950 dark:text-white">{fa.panel.wallet.topup}</h2>
                  <p className="mt-1 text-xs leading-5 text-navy-500 dark:text-navy-400">{fa.panel.wallet.topupDemoHint}</p>

                  <label htmlFor="topup-amount" className="sr-only">
                     {fa.panel.wallet.topupAmount}
                  </label>
                  <input
                     id="topup-amount"
                     type="number"
                     min={1}
                     step="any"
                     inputMode="decimal"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder={fa.panel.wallet.topupAmount}
                     dir="ltr"
                     className={`${AMOUNT_CLASS} mt-4`}
                  />

                  <Button onClick={handleTopUp} disabled={busy || !amount} className="mt-3">
                     <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
                     {fa.panel.wallet.topupSubmit}
                  </Button>

                  {hint ? (
                     <motion.p
                        initial={{ opacity: 0, y: prefersReduced ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"
                     >
                        {hint}
                     </motion.p>
                  ) : null}
               </div>
            </div>
         </Reveal>

         {/* Ledger */}
         <Reveal delay={0.14}>
            <h2 className="mt-10 text-lg font-bold text-navy-950 dark:text-white">{fa.panel.wallet.history}</h2>
         </Reveal>

         {transactions.length === 0 ? (
            <div className="mt-4">
               <EmptyState
                  icon={<WalletIcon className="h-6 w-6" aria-hidden="true" />}
                  title={fa.panel.wallet.emptyTitle}
                  body={fa.panel.wallet.emptyBody}
                  tone="brand"
               />
            </div>
         ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
               <ul className="divide-y divide-border-subtle">
                  {transactions.map((tx) => {
                     const credit = tx.type === "topup" || tx.type === "refund"
                     return (
                        <li key={tx.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-muted/60">
                           <span
                              className={[
                                 "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                 credit
                                    ? "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300"
                                    : "bg-red-600/15 text-red-800 dark:text-red-300",
                              ].join(" ")}
                           >
                              {credit ? (
                                 <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                 <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                           </span>
                           <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-navy-950 dark:text-white">
                                 {fa.panel.wallet.type[tx.type]}
                              </span>
                              <span className="mt-0.5 block text-xs text-navy-500 dark:text-navy-400">
                                 {formatDate(tx.created_at)}
                              </span>
                           </span>
                           <span
                              className={[
                                 "shrink-0 text-sm font-extrabold",
                                 credit ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300",
                              ].join(" ")}
                              dir="ltr"
                           >
                              {credit ? "+" : "−"}${Number(tx.amount).toLocaleString("en-US")}
                           </span>
                        </li>
                     )
                  })}
               </ul>
            </div>
         )}
      </div>
   )
}