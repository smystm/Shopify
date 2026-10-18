"use client"

import { motion, useReducedMotion } from "motion/react"
import { CheckCircleIcon, PaperAirplaneIcon, ShoppingBagIcon, TruckIcon } from "@heroicons/react/24/outline"
import type { OrderStatus } from "@/app/contracts/panel"
import { fa } from "@/app/lib/i18n/fa"

interface OrderTimelineProps {
   status: OrderStatus
   /** A skin arrives through a Steam trade; pure service orders skip that step. */
   includesTradeStep?: boolean
}

/**
 * Where this order sits in its journey, drawn as the steps the customer
 * actually cares about: the order was placed, the shop sent its trade request,
 * the goods were delivered.
 *
 * Exception states (disputed, refunded, cancelled) render as a full-width
 * banner instead of a progress track, because those are not "somewhere in the
 * middle" - they are outcomes out of the ordinary path, and pretending
 * otherwise would make the tracker lie.
 */
export default function OrderTimeline({ status, includesTradeStep = true }: OrderTimelineProps) {
   const prefersReduced = useReducedMotion()

   if (status === "disputed" || status === "refunded" || status === "cancelled") {
      const copy = fa.panel.orders.timeline[status]
      return (
         <div className="flex items-start gap-3 rounded-2xl border border-accent-500/40 bg-accent-500/8 px-5 py-4">
            <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
            <span>
               <span className="block text-sm font-extrabold text-navy-950 dark:text-white">{copy.title}</span>
               <span className="mt-1 block text-xs leading-6 text-navy-600 dark:text-navy-300">{copy.body}</span>
            </span>
         </div>
      )
   }

   // The stage a skin order is sitting in right now.
   const stage = stageOf(status)

   const steps = [
      { key: "placed", label: fa.panel.orders.timeline.placed.label, hint: fa.panel.orders.timeline.placed.hint, done: true, Icon: ShoppingBagIcon },
      ...(includesTradeStep
         ? [
              {
                 key: "trade",
                 label: fa.panel.orders.timeline.tradeSent.label,
                 hint: fa.panel.orders.timeline.tradeSent.hint,
                 done: stage >= 2,
                 Icon: PaperAirplaneIcon,
              },
           ]
         : []),
      { key: "delivered", label: fa.panel.orders.timeline.delivered.label, hint: fa.panel.orders.timeline.delivered.hint, done: stage >= 3, Icon: TruckIcon },
   ]

   return (
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
         {steps.map((step, index) => {
            const isCurrent = !step.done && stepOfNext(index, steps)
            const tone = step.done
               ? "border-brand-500/40 bg-brand-500/8 text-brand-800 dark:border-brand-400/30 dark:text-brand-200"
               : isCurrent
                  ? "border-accent-500/40 bg-accent-500/8 text-accent-800 dark:text-accent-300"
                  : "border-border-subtle bg-surface text-navy-400 dark:text-navy-500"

            return (
               <motion.li
                  key={step.key}
                  initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden rounded-2xl border px-4 py-3.5 transition-colors duration-300 hover:shadow-md hover:shadow-brand-500/5 ${tone}`}
               >
                  <span
                     aria-hidden="true"
                     className="pointer-events-none absolute -inset-e-10 -top-10 h-24 w-24 rounded-full bg-brand-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start gap-3">
                     <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                           step.done
                              ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                              : isCurrent
                                 ? "bg-accent-500/20 text-accent-700 dark:text-accent-300"
                                 : "bg-navy-100 text-navy-400 dark:bg-navy-800"
                        }`}
                     >
                        {step.done ? (
                           <motion.span
                              initial={prefersReduced ? false : { scale: 0, rotate: -45 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 460, damping: 18, delay: 0.15 + index * 0.08 }}
                           >
                              <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                           </motion.span>
                        ) : (
                           <step.Icon className={`h-4 w-4 ${isCurrent ? "animate-pulse" : ""}`} aria-hidden="true" />
                        )}
                     </span>
                     <div className="min-w-0">
                        <p className="text-sm font-bold leading-5">{step.label}</p>
                        <p className="mt-0.5 text-[11px] leading-5 opacity-80">{step.hint}</p>
                     </div>
                  </div>
               </motion.li>
            )
         })}
      </ol>
   )
}

/** 1 = placed, 2 = trade on its way, 3 = delivered. */
function stageOf(status: OrderStatus): number {
   switch (status) {
      case "trade_sent":
         return 2
      case "completed":
         return 3
      default:
         return 1
   }
}

/** A step is "current" when it is the first step that is not done yet. */
function stepOfNext(index: number, steps: Array<{ done: boolean }>): boolean {
   return steps.findIndex((step) => !step.done) === index
}
