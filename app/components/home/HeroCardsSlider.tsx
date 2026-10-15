"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline"
import { useReducedMotion } from "motion/react"
import { categoryIconStyle } from "@/app/lib/catalog"
import type { ProductWithImage } from "@/app/lib/catalog"
import { fa } from "@/app/lib/i18n/fa"
import { formatToman } from "@/app/lib/formatPrice"

/** How long each slide stays up before auto-advancing. */
const AUTOPLAY_MS = 3000

/**
 * Card width as a share of the stage. Smaller than a single-card hero on
 * purpose: the cards behind need somewhere to fan out to.
 */
const SLIDE_BASIS = { base: "70%", sm: "50%", lg: "54%" }

/** Geometry of the layered deck, in CSS pixels/degrees per neighboring card. */
const STACK_OFFSET = 25
const DEPTH_PER_SLIDE = 135

/** Yaw per slide-distance. Swiper's own `cards` default is 10deg; a little more
 *  reads better on cards this small, where a subtle yaw is barely visible. */
const YAW_PER_SLIDE = 8
const ROLL_PER_SLIDE = 2

/** Scale falloff per slide-distance. Deliberately gentle — perspective is
 *  already shrinking the distant cards, so stacking scale on top flattens it. */
const SHRINK_PER_SLIDE = 0.025

/** How much the image inside a card zooms relative to its own card. Mirrors
 *  the reference's `data-swiper-parallax-scale="1.1"`: the picture leads the
 *  card motion, so depth reads inside the card and not only between cards. */
const IMAGE_PARALLAX = 0.18

/** Centre card sits slightly proud of the rest. */
const CENTRE_SCALE = 1.00

/** |d| under this counts as the centre slide. */
const CENTRE_THRESHOLD = 0.5

/** Beyond this distance a slide is hidden outright. */
const VISIBLE_LIMIT = 2.6

interface HeroCardsSliderProps {
   products: ProductWithImage[]
   loading?: boolean
}

export default function HeroCardsSlider({ products, loading }: HeroCardsSliderProps) {
   const prefersReduced = useReducedMotion()

   const [emblaRef, emblaApi] = useEmblaCarousel({
      // Embla loops natively, so the slide list is never duplicated the way the
      // reference achieves its infinite effect.
      loop: true,
      align: "center",
      direction: "rtl",
      slidesToScroll: 1,
      duration: prefersReduced ? 0 : 32,
   })

   const [userPaused, setUserPaused] = useState(false)
   const [interacting, setInteracting] = useState(false)
   const [pageVisible, setPageVisible] = useState(true)
   const [centreIndex, setCentreIndex] = useState(0)
   const [canPrev, setCanPrev] = useState(false)
   const [canNext, setCanNext] = useState(false)

   useEffect(() => {
      const onVisibility = () => setPageVisible(!document.hidden)
      document.addEventListener("visibilitychange", onVisibility)
      return () => document.removeEventListener("visibilitychange", onVisibility)
   }, [])

   /**
    * Fan the inner cards into a shallow, layered deck. Embla owns each outer
    * slide's transform (including its loop teleport), so only the inner card
    * is transformed here. Measuring actual slide positions also stays correct
    * through Embla's loop seam, where scrollProgress is not a slide index.
    */
   const applyTransforms = useCallback(() => {
      if (!emblaApi) return

      const slides = emblaApi.slideNodes()
      if (slides.length === 0) return

      const viewportRect = emblaApi.rootNode().getBoundingClientRect()
      const viewportCentre = viewportRect.left + viewportRect.width / 2
      // Read first, then write, so the per-frame effect does not force a layout
      // between every card while the carousel is moving.
      const metrics = slides.map((slide) => {
         const rect = slide.getBoundingClientRect()
         return { slide, offset: rect.left + rect.width / 2 - viewportCentre, step: rect.width }
      })

      metrics.forEach(({ slide, offset, step }) => {
         const d = offset / Math.max(step, 1)
         const abs = Math.abs(d)
         const isCentre = abs < CENTRE_THRESHOLD
         const direction = Math.sign(offset)
         const fan = direction * STACK_OFFSET * Math.min(abs, 2)
         const translateX = -offset + fan
         const lift = isCentre ? -3 : Math.min(abs, 2) * 7
         const yaw = direction * YAW_PER_SLIDE * Math.min(abs, 2)
         const roll = -direction * ROLL_PER_SLIDE * Math.min(abs, 2)
         const scale = isCentre ? CENTRE_SCALE : 1 - abs * SHRINK_PER_SLIDE

         const stack = slide.querySelector<HTMLElement>("[data-hero-stack]")
         if (stack) {
            stack.style.transform = `translate3d(${translateX}px, ${lift}px, ${-DEPTH_PER_SLIDE * abs}px) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(${scale})`
         }
         // Leave transform untouched: Embla uses it to reposition loop slides.
         slide.style.zIndex = String(1000 - Math.round(abs * 10))
         slide.style.opacity = abs > VISIBLE_LIMIT ? "0" : "1"
         slide.style.pointerEvents = abs < 1.7 ? "auto" : "none"

         // The stacked-card shadow the reference gets from Swiper's injected
         // .swiper-slide-shadow.
         const shadow = slide.querySelector<HTMLElement>("[data-hero-shadow]")
         if (shadow) {
            shadow.style.transform = `scale(${1 - 0.07 * abs})`
            shadow.style.opacity = String(Math.min(abs, 1))
         }

         // Parallax: the picture zooms further than the card holding it.
         const image = slide.querySelector<HTMLElement>("[data-hero-image]")
          if (image) image.style.setProperty("--hero-image-scale", String(1 + abs * IMAGE_PARALLAX))

         const card = slide.querySelector<HTMLElement>("[data-hero-card]")
         if (card) card.dataset.centre = String(isCentre)
      })
   }, [emblaApi])

   useEffect(() => {
      if (!emblaApi) return
      applyTransforms()
      // `scroll` fires on every frame of a scroll or drag, which is what keeps
      // the rotation glued to the track while dragging, not just on release.
      emblaApi.on("scroll", applyTransforms)
      emblaApi.on("reInit", applyTransforms)
      emblaApi.on("resize", applyTransforms)
      emblaApi.on("select", applyTransforms)
      return () => {
         emblaApi.off("scroll", applyTransforms)
         emblaApi.off("reInit", applyTransforms)
         emblaApi.off("resize", applyTransforms)
         emblaApi.off("select", applyTransforms)
      }
   }, [emblaApi, applyTransforms])

   const autoPlayPaused = userPaused || interacting || prefersReduced || !pageVisible

   useEffect(() => {
      if (autoPlayPaused || !emblaApi || products.length < 2) return
      const id = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS)
      return () => clearInterval(id)
   }, [autoPlayPaused, emblaApi, products.length])

   useEffect(() => {
      if (!emblaApi) return
      const sync = () => {
         setCentreIndex(emblaApi.selectedScrollSnap())
         setCanPrev(emblaApi.canScrollPrev())
         setCanNext(emblaApi.canScrollNext())
      }
      emblaApi.on("init", sync)
      emblaApi.on("select", sync)
      emblaApi.on("reInit", sync)
      const frame = requestAnimationFrame(sync)
      return () => {
         cancelAnimationFrame(frame)
         emblaApi.off("init", sync)
         emblaApi.off("select", sync)
         emblaApi.off("reInit", sync)
      }
   }, [emblaApi])

   if (!loading && products.length === 0) {
      return (
         <div className="rounded-3xl border border-dashed border-navy-300 p-10 text-center text-sm text-navy-500 dark:border-navy-700 dark:text-navy-400">
            {fa.home.categories.empty}
         </div>
      )
   }

   const slides = loading ? Array.from({ length: 3 }, () => null) : products
   const total = slides.length

   const arrowClass =
      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface/90 text-navy-700 shadow-sm backdrop-blur transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-95 disabled:pointer-events-none disabled:opacity-35 dark:border-navy-700 dark:bg-navy-900/90 dark:text-navy-100 dark:hover:bg-brand-500 dark:hover:text-white"

   return (
      <div
         role="region"
         aria-roledescription="carousel"
         aria-label={fa.home.carousel.heroLabel}
         className="herocards w-full"
         style={
            {
               "--slide-basis": SLIDE_BASIS.base,
               "--slide-basis-sm": SLIDE_BASIS.sm,
               "--slide-basis-lg": SLIDE_BASIS.lg,
               "--carousel-gap": "12px",
            } as React.CSSProperties
         }
         onMouseEnter={() => setInteracting(true)}
         onMouseLeave={() => setInteracting(false)}
         onFocusCapture={() => setInteracting(true)}
         onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setInteracting(false)
         }}
      >
         {/* The viewport remains overflow-visible so cards can fan naturally;
             HeroSection supplies the visual column's clipping boundary. */}
         <div ref={emblaRef} className="herocards-viewport overflow-visible py-8">
            <div className="herocards-track flex items-center">
               {slides.map((product, index) => (
                  <div
                     key={product ? product.id : `skeleton-${index}`}
                     className="carousel-slide herocards-slide"
                     role="group"
                     aria-roledescription="slide"
                     aria-label={product ? fa.home.carousel.slide.replace("{index}", String(index + 1)).replace("{total}", String(total)) : undefined}
                     aria-hidden={!product || undefined}
                  >
                     {product ? (
                        <div data-hero-stack className="hero-card-stack">
                         <Link
                            href={`/products/${product.id}`}
                            className="group relative block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                         >
                           {/* Stacked-card shadow, standing in for Swiper's
                               injected .swiper-slide-shadow. */}
                           <span
                              data-hero-shadow
                              aria-hidden="true"
                              className="herocards-shadow pointer-events-none absolute inset-x-3 -bottom-1 h-6 rounded-2xl bg-navy-950/70 blur-lg dark:bg-black/70"
                           />

                            <div data-hero-card data-centre="false" className="herocards-card relative overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-sm">
                               <span aria-hidden="true" className="hero-card-aura pointer-events-none absolute -inset-8 z-0 rounded-4xl" />

                               {/* ---------- Image stage: keeps ProductCard proportions, with a poster-like treatment ---------- */}
                               <div className="hero-card-stage relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-navy-100 via-white to-brand-50 dark:from-navy-950 dark:via-navy-900 dark:to-brand-950/70">
                                  <span aria-hidden="true" className="hero-card-grid pointer-events-none absolute inset-0 opacity-50" />
                                 <span
                                    aria-hidden="true"
                                     className="hero-card-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                 />
                                  <span aria-hidden="true" className="hero-card-shine pointer-events-none absolute -inset-y-10 -inset-s-1/2 z-10 w-1/3 rotate-12 opacity-0 transition-all duration-700 group-hover:inset-s-[125%] group-hover:opacity-100" />

                                 <Image
                                    data-hero-image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 1024px) 70vw, 300px"
                                     className="herocards-image relative object-contain p-7 drop-shadow-xl"
                                    unoptimized
                                    priority={index === 0}
                                 />

                                  <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
                                     <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-navy-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-navy-950/60 dark:text-navy-100">
                                        <span className="h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_0_3px_rgba(251,191,36,0.18)]" />
                                        {fa.home.heroShowcase.eyebrow}
                                     </span>

                                     {product.category?.value && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-l from-brand-700 to-brand-800 px-2.5 py-1 text-[10px] font-bold text-white shadow-md shadow-brand-900/25 ring-1 ring-white/15">
                                           <span
                                              aria-hidden="true"
                                              className="h-4 w-5 bg-current mask-center mask-contain mask-no-repeat"
                                              style={categoryIconStyle(product.category.value)}
                                           />
                                           {fa.home.categories.labels[product.category.value] ?? product.category.value}
                                        </span>
                                     )}
                                  </div>

                                  <span className="absolute inset-x-4 bottom-3 z-10 flex items-center justify-between text-[10px] font-semibold tracking-wide text-navy-500 dark:text-navy-400">
                                     <span>{product.productNumber}</span>
                                     <span className="rounded-full bg-white/55 px-2 py-1 backdrop-blur-sm dark:bg-navy-950/45">CS MARKET</span>
                                  </span>

                                 <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-surface to-transparent" />
                              </div>

                               {/* ---------- Body: same hierarchy as ProductCard, with a compact poster caption ---------- */}
                               <div className="herocards-body relative flex flex-col p-5">
                                  <div className="flex items-start justify-between gap-2">
                                     <h3 className="line-clamp-1 min-w-0 text-[15px] font-extrabold text-navy-950 transition-colors duration-300 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                                        {product.title}
                                     </h3>
                                     <span className="shrink-0 rounded-full bg-accent-400/15 px-2 py-1 text-[10px] font-bold text-accent-700 dark:bg-accent-400/15 dark:text-accent-300">
                                        #{String(product.id).padStart(2, "0")}
                                     </span>
                                  </div>

                                  <p className="mt-2 line-clamp-1 min-h-6 text-xs leading-6 text-navy-600 dark:text-navy-300">{product.desc}</p>

                                 <span aria-hidden="true" className="my-4 h-px w-full bg-border-subtle" />

                                 <div className="flex items-center justify-end gap-1.5">
                                    <div className="bg-linear-to-l from-brand-800 to-brand-700 bg-clip-text text-lg font-extrabold text-transparent">
                                       {formatToman(product.price)}
                                    </div>
                                    <div className="text-[11px] font-medium text-navy-500 dark:text-navy-400">{fa.products.priceLabel}</div>
                                 </div>

                                 <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-brand-500/25 bg-brand-50/80 px-4 py-2 text-sm font-bold text-brand-700 transition-all duration-300 group-hover:border-transparent group-hover:bg-linear-to-l group-hover:from-brand-700 group-hover:to-brand-800 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-700/30 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300 dark:group-hover:text-white">
                                    {fa.products.view}
                                    <ArrowLeftIcon
                                       className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:scale-x-[-1] rtl:group-hover:translate-x-0.5"
                                       aria-hidden="true"
                                    />
                                 </span>
                              </div>
                           </div>
                         </Link>
                        </div>
                     ) : (
                        <div className="animate-pulse rounded-2xl border border-border-strong bg-surface">
                           <div className="aspect-4/3 w-full rounded-t-2xl bg-navy-100 dark:bg-navy-900" />
                           <div className="space-y-3 p-5">
                              <div className="h-4 w-3/4 rounded bg-navy-100 dark:bg-navy-900" />
                              <div className="h-5 w-1/3 rounded bg-navy-100 dark:bg-navy-900" />
                              <div className="h-9 w-full rounded-2xl bg-navy-100 dark:bg-navy-900" />
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-4 flex items-center justify-center gap-2.5">
            <button type="button" onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label={fa.home.carousel.prev} className={arrowClass}>
               <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {!prefersReduced && total > 1 && (
               <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-pressed={autoPlayPaused}
                  aria-label={autoPlayPaused ? fa.home.carousel.play : fa.home.carousel.pause}
                  className={arrowClass}
               >
                  {autoPlayPaused ? <PlayIcon className="h-4 w-4" aria-hidden="true" /> : <PauseIcon className="h-4 w-4" aria-hidden="true" />}
               </button>
            )}

            <button type="button" onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label={fa.home.carousel.next} className={arrowClass}>
               <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
         </div>

         {/* Screen-reader position: the depth effect carries no dots. */}
         <p className="sr-only" aria-live="polite">
            {fa.home.carousel.slide.replace("{index}", String(Math.min(Math.max(centreIndex, 0), total - 1) + 1)).replace("{total}", String(total))}
         </p>
      </div>
   )
}
