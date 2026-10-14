"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowsRightLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import type { TradeOffer } from "@/app/contracts/panel"
import { getTradeOffers, respondToTradeOffer } from "@/app/helpers/panelApi"
import { TradeOfferStatusBadge } from "@/app/components/ui/OrderStatusBadge"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import Button from "@/app/components/ui/Button"
import { fa } from "@/app/lib/i18n/fa"

function formatDate(ms: number | null): string {
   if (!ms) return "—"
   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(ms))
}

export default function OffersClient() {
   const prefersReduced = useReducedMotion()
   const [incoming, setIncoming] = useState<TradeOffer[]>([])
   const [outgoing, setOutgoing] = useState<TradeOffer[]>([])
   const [loading, setLoading] = useState(true)
   const [busyId, setBusyId] = useState<number | null>(null)
   const [hint, setHint] = useState<string | null>(null)

   const load = () => {
      getTradeOffers()
         .then((res) => {
            setIncoming(res.incoming)
            setOutgoing(res.outgoing)
         })
         .catch(() => {})
         .finally(() => setLoading(false))
   }

   useEffect(() => {
      load()
   }, [])

   const respond = async (offer: TradeOffer, status: "accepted" | "declined") => {
      setBusyId(offer.id)
      setHint(null)
      try {
         await respondToTradeOffer(offer.id, status)
         setHint(status === "accepted" ? fa.panel.offers.acceptedHint : fa.panel.offers.declinedHint)
         load()
      } catch {
         setHint(fa.panel.offers.alreadyAnswered)
         load()
      } finally {
         setBusyId(null)
      }
   }

   if (loading) {
      return (
         <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
               <div key={i} className="h-28 animate-pulse rounded-2xl bg-navy-200/70 dark:bg-navy-800/50" />
            ))}
         </div>
      )
   }

   const allEmpty = incoming.length === 0 && outgoing.length === 0

   return (
      <div>
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{fa.panel.offers.title}</h1>
            <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{fa.panel.offers.subtitle}</p>
         </Reveal>

         {hint ? (
            <motion.p
               initial={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-500/12 px-4 py-2 text-sm font-bold text-brand-700 dark:text-brand-300"
            >
               {hint}
            </motion.p>
         ) : null}

         {allEmpty ? (
            <div className="mt-8">
               <EmptyState
                  icon={<ArrowsRightLeftIcon className="h-6 w-6" aria-hidden="true" />}
                  title={fa.panel.offers.emptyTitle}
                  body={fa.panel.offers.emptyBody}
                  tone="accent"
               />
            </div>
         ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
               <OfferColumn
                  title={fa.panel.offers.incoming}
                  offers={incoming}
                  busyId={busyId}
                  onRespond={respond}
               />
               <OfferColumn title={fa.panel.offers.outgoing} offers={outgoing} busyId={busyId} onRespond={respond} />
            </div>
         )}
      </div>
   )
}

function OfferColumn({
   title,
   offers,
   busyId,
   onRespond,
}: {
   title: string
   offers: TradeOffer[]
   busyId: number | null
   onRespond: (offer: TradeOffer, status: "accepted" | "declined") => void
}) {
   const prefersReduced = useReducedMotion()

   return (
      <section>
         <h2 className="flex items-center gap-2 text-lg font-bold text-navy-950 dark:text-white">
            <span className="text-navy-500 dark:text-navy-400">
               <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            {title}
            <span className="text-sm font-medium text-navy-500 dark:text-navy-400">
               ({offers.length.toLocaleString("fa-IR")})
            </span>
         </h2>

         {offers.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-navy-300 bg-surface px-5 py-8 text-center text-sm text-navy-600 dark:border-navy-700 dark:text-navy-300">
               {fa.panel.offers.emptyBody}
            </p>
         ) : (
            <div className="mt-4 space-y-3">
               {offers.map((offer, i) => {
                  const actionable = offer.direction === "incoming" && offer.status === "pending"
                  return (
                     <motion.article
                        key={offer.id}
                        initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl border border-border-strong bg-surface p-5 shadow-md shadow-navy-900/5"
                     >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                           <div>
                              <p className="text-sm font-bold text-navy-950 dark:text-white">
                                 {offer.direction === "incoming"
                                    ? fa.panel.offers.directionIncoming
                                    : fa.panel.offers.directionOutgoing}
                              </p>
                              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                                 {formatDate(offer.created_at)}
                              </p>
                           </div>
                           <TradeOfferStatusBadge status={offer.status} />
                        </div>

                        {offer.steam_offer_url ? (
                           <a
                              href={offer.steam_offer_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              dir="ltr"
                              className="mt-3 block truncate text-xs text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                           >
                              {offer.steam_offer_url}
                           </a>
                        ) : null}

                        {actionable ? (
                           <div className="mt-4 flex flex-wrap gap-2 border-t border-border-subtle pt-4">
                              <Button
                                 onClick={() => onRespond(offer, "accepted")}
                                 disabled={busyId === offer.id}
                                 className="w-auto flex-1"
                              >
                                 <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.panel.offers.accept}
                              </Button>
                              <Button
                                 onClick={() => onRespond(offer, "declined")}
                                 disabled={busyId === offer.id}
                                 className="w-auto flex-1 !bg-navy-700 hover:!bg-navy-800 dark:!bg-navy-700"
                              >
                                 <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                 {fa.panel.offers.decline}
                              </Button>
                           </div>
                        ) : null}
                     </motion.article>
                  )
               })}
            </div>
         )}
      </section>
   )
}