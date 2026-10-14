"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

/** Scroll speed in px/second, so the pace stays constant as the track resizes. */
const SPEED_PX_PER_SEC = 55

/**
 * Infinite horizontal scroll of weapon classes.
 *
 * Three things have to line up for a loop that nobody can see the seam of:
 *
 *  1. The track translates by exactly ONE group's width. When group 1 has
 *     scrolled fully off the left, group 2 occupies its exact starting
 *     position, so snapping back to 0 is invisible. That one-group distance is
 *     precisely "-50%" of the track when there are two groups — measuring it
 *     directly keeps the same wrap at any number of groups, which is what lets
 *     the track grow to cover a wide screen.
 *
 *  2. Enough groups to cover the section PLUS one whole group, so a group is
 *     always already in place when the wrap happens.
 *
 *  3. The track is anchored to the section's LEFT edge. A `w-max` block in an
 *     RTL page aligns to the RIGHT, so shifting left would slide the content
 *     off that right-hand edge and empty the strip — this is exactly what the
 *     coverage test caught (`margin-inline-start: auto` does not fix it: on an
 *     over-sized `w-max` box the free space is negative and the auto margin
 *     resolves to a large negative value). The LTR, full-width wrapper below
 *     pins the track's left edge to the section's instead, deterministically.
 *
 * Spacing rides on each group (`gap-3` plus a trailing `pr-3`) rather than on
 * the pills: a gap BETWEEN two groups belongs to no pill, so it would be
 * missing at the wrap point and leave a visible notch.
 */
export default function Marquee() {
   const prefersReduced = useReducedMotion()
   const groupRef = useRef<HTMLDivElement>(null)

   // px travelled per cycle, and how many groups to render to fill the screen.
   const [shift, setShift] = useState(0)
   const [copies, setCopies] = useState(2)

   useEffect(() => {
      const group = groupRef.current
      if (!group) return

      const measure = () => {
         const groupWidth = group.getBoundingClientRect().width
         if (!groupWidth) return

         // section width + one group of runway, so the incoming group is
         // already in place before the outgoing one leaves.
         const sectionWidth = group.closest("section")?.getBoundingClientRect().width ?? window.innerWidth
         setCopies(Math.max(2, Math.ceil((sectionWidth + groupWidth) / groupWidth)))
         setShift(groupWidth)
      }

      measure()

      const observer = new ResizeObserver(measure)
      observer.observe(group)
      window.addEventListener("resize", measure)
      return () => {
         observer.disconnect()
         window.removeEventListener("resize", measure)
      }
   }, [])

   const items = fa.home.categories.items

   return (
      <section aria-label={fa.home.marquee.label} className="relative overflow-hidden py-2">
         {/* Edge fades */}
         <div className="pointer-events-none absolute inset-y-0 inset-s-0 z-10 w-24 bg-gradient-to-e from-navy-50 to-transparent dark:from-navy-950" />
         <div className="pointer-events-none absolute inset-y-0 inset-e-0 z-10 w-24 bg-linear-to-l from-navy-50 to-transparent dark:from-navy-950" />

         {/* dir=ltr so the pills run left-to-right and each group's trailing
             padding lands on its right; every pill keeps dir="auto" so Persian
             labels still render correctly. The wrapper is full width so the
             track — which overflows it to the right and is clipped by the
             section — starts flush with the section's left edge. */}
         <div dir="ltr" className="flex w-full">
            <motion.div
               /* shrink-0 matters: as a flex item of the wrapper this would be
                  squeezed to the wrapper's width, and the track's box would
                  stop matching its own content — which throws off the
                  one-group arithmetic and leaves a bare strip. */
               className="flex w-max shrink-0 py-3"
               /* shift is 0 until the first measurement lands, which pins the
                  track in place rather than letting it jump. */
               animate={prefersReduced || shift === 0 ? undefined : { x: [0, -shift] }}
               transition={{ duration: shift / SPEED_PX_PER_SEC, repeat: Infinity, ease: "linear" }}
            >
               {Array.from({ length: copies }, (_, copyIndex) => (
                  <div
                     key={copyIndex}
                     ref={copyIndex === 0 ? groupRef : undefined}
                     className="flex shrink-0 gap-3 pe-3"
                     /* The extra groups are the loop's buffer — they must not be
                        announced a second time. */
                     aria-hidden={copyIndex > 0 ? true : undefined}
                  >
                     {items.map((item, i) => (
                        <span
                           key={`${item.slug}-${i}`}
                           dir="auto"
                           className="shrink-0 rounded-full border border-border-subtle bg-surface px-5 py-2 text-sm font-semibold text-navy-600 dark:text-navy-200"
                        >
                           {item.label}
                        </span>
                     ))}
                  </div>
               ))}
            </motion.div>
         </div>
      </section>
   )
}
