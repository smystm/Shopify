import type { ReactNode } from "react"
import Reveal from "@/app/components/ui/Reveal"

interface PageHeroProps {
   /** Plain text, or a node when the heading needs client-side state. */
   /** Plain text, or a node when the heading needs client-side state. */
   title: ReactNode
   description?: string
   /** Small chip above the title, e.g. a section label. */
   badge?: ReactNode
   /** Render the title as h2 when the page already owns an h1. */
   headingLevel?: "h1" | "h2"
   /** Optional slot to the start of the text block — e.g. an avatar tile. */
   leading?: ReactNode
   className?: string
}

/**
 * Gradient hero band used at the top of a page.
 *
 * Fully theme-aware: a light turquoise→saffron wash in light mode, the deep
 * midnight-navy gradient in dark mode. Every colour, the glows and the grid
 * texture all swap together, so the band never reads as "dark text on a light
 * card" or vice-versa.
 */
export default function PageHero({
   title,
   description,
   badge,
   headingLevel = "h1",
   leading,
   className = "",
}: PageHeroProps) {
   const Heading = headingLevel

   const textBlock = (
      <>
         {badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-300">
               {badge}
            </span>
         ) : null}

         <Heading className={`font-bold tracking-tight text-navy-950 dark:text-white ${badge ? "mt-5" : ""} text-3xl md:text-4xl`}>
            {title}
         </Heading>

         {description ? <p className="mt-3 max-w-xl text-base leading-7 text-navy-600 dark:text-navy-300">{description}</p> : null}
      </>
   )

   return (
      <Reveal>
         <section
            className={`relative overflow-hidden rounded-3xl border border-brand-500/20 bg-linear-to-bl from-brand-50 via-surface to-accent-50/70 px-8 py-12 shadow-2xl shadow-navy-900/10 dark:border-brand-400/20 dark:from-navy-900 dark:via-navy-950 dark:to-navy-900 dark:shadow-black/30 ${className}`}
         >
            {/* Ambient glows */}
            <div
               aria-hidden="true"
               className="pointer-events-none absolute -inset-e-20 -top-20 h-64 w-64 rounded-full bg-brand-400/30 blur-[90px] dark:bg-brand-500/25"
            />
            <div
               aria-hidden="true"
               className="pointer-events-none absolute -bottom-24 -inset-s-16 h-64 w-64 rounded-full bg-accent-400/35 blur-[90px] dark:bg-accent-500/20"
            />

            {/* Grid texture */}
            <div
               aria-hidden="true"
               className="pointer-events-none absolute inset-0 text-navy-600 opacity-[0.10] dark:text-navy-100 dark:opacity-[0.06]"
               style={{
                  backgroundImage:
                     "linear-gradient(to left, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
               }}
            />

            <div className="relative z-10">
               {leading ? (
                  <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-start">
                     {leading}
                     <div className="min-w-0">{textBlock}</div>
                  </div>
               ) : (
                  textBlock
               )}
            </div>
         </section>
      </Reveal>
   )
}