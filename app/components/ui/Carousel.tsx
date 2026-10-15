"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useReducedMotion } from "motion/react"
import { fa } from "@/app/lib/i18n/fa"

interface SlidesPerView {
   base: number
   sm?: number
   lg?: number
}

interface CarouselProps {
   children: React.ReactNode
   /** How many slides fit at each breakpoint. Drives the slide widths. */
   slidesPerView: SlidesPerView
   /** Distance in slides moved per arrow press. */
   step?: number
   /** Visual gap between slides, in px. Split as padding on each slide. */
   gap?: number
   className?: string
}

/** Class every slide must carry; the widths come from `--slide-basis*`. */
export const CAROUSEL_SLIDE_CLASS = "carousel-slide"

/**
 * Embla wrapper shared by the category and featured carousels.
 *
 * Only the two things the home page actually needs are exposed: a track and a
 * pair of arrows that disable themselves at each end. Writing this once keeps
 * the RTL setup, the reduced-motion opt-out and the disabled-arrow behaviour
 * identical across sections instead of re-deciding them per component.
 *
 * Slide widths are the caller's job - see `slideBasis`.
 */
export default function Carousel({ children, slidesPerView, step = 1, gap = 16, className = "" }: CarouselProps) {
   const prefersReduced = useReducedMotion()

   const [emblaRef, emblaApi] = useEmblaCarousel({
      // The page is RTL, so the track has to advance leftwards; without this
      // the arrows move the opposite way to the content.
      direction: "rtl",
      align: "start",
      slidesToScroll: step,
      containScroll: "trimSnaps",
      // Embla v8 has no `scrollBehavior` option - scroll duration is the knob,
      // and 0 makes the jump instant for reduced-motion users.
      duration: prefersReduced ? 0 : 25,
   })

   const [canPrev, setCanPrev] = useState(false)
   const [canNext, setCanNext] = useState(false)

   const syncArrows = useCallback(() => {
      if (!emblaApi) return
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
   }, [emblaApi])

   useEffect(() => {
      if (!emblaApi) return

      // Embla emits `init` on a setTimeout(0), and `reInit` whenever the track
      // is rebuilt (slides changed, window resized). Listening for those gives
      // the first sync without calling setState synchronously in the effect
      // body, which would cascade renders.
      emblaApi.on("init", syncArrows)
      emblaApi.on("select", syncArrows)
      emblaApi.on("reInit", syncArrows)
      return () => {
         emblaApi.off("init", syncArrows)
         emblaApi.off("select", syncArrows)
         emblaApi.off("reInit", syncArrows)
      }
   }, [emblaApi, syncArrows])

   const arrowClass =
      "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-navy-700 shadow-sm transition-all duration-200 hover:border-brand-400 hover:bg-brand-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-35 disabled:hover:border-border-strong disabled:hover:bg-surface disabled:hover:text-navy-700 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:hover:bg-brand-500 dark:hover:text-white"

   // Slide widths as custom properties rather than generated class names:
   // `.carousel-slide` in globals.css reads these at each breakpoint.
   const slideStyle = {
      "--carousel-gap": `${gap}px`,
      "--slide-basis": `${100 / slidesPerView.base}%`,
      ...(slidesPerView.sm ? { "--slide-basis-sm": `${100 / slidesPerView.sm}%` } : {}),
      ...(slidesPerView.lg ? { "--slide-basis-lg": `${100 / slidesPerView.lg}%` } : {}),
   } as React.CSSProperties

   return (
      <div className={className} style={slideStyle}>
         <div className="mb-6 flex items-center justify-end gap-2">
            <button
               type="button"
               onClick={() => emblaApi?.scrollPrev()}
               disabled={!canPrev}
               aria-label={fa.home.carousel.prev}
               className={arrowClass}
            >
               {/* In RTL the "previous" control sits on the right. */}
               <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
               type="button"
               onClick={() => emblaApi?.scrollNext()}
               disabled={!canNext}
               aria-label={fa.home.carousel.next}
               className={arrowClass}
            >
               <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
         </div>

         <div ref={emblaRef} className="overflow-hidden">
            {/* No `gap` here: the spacing is each slide's own padding, so
                percentage bases keep the track exactly viewport-wide. */}
            <div className="flex">{children}</div>
         </div>
      </div>
   )
}
