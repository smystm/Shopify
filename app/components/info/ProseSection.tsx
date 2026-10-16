import type { ReactNode } from "react"
import SectionHeading from "@/app/components/ui/SectionHeading"
import Reveal from "@/app/components/ui/Reveal"

interface ProseSectionProps {
   title: string
   paragraphs: readonly string[]
   /**
    * Extra block rendered under the text - a list, a callout, a stat strip.
    */
   children?: ReactNode
   /** "start" keeps the heading left-aligned, which suits body copy. */
   align?: "center" | "start"
   className?: string
}

/**
 * A heading followed by a reading column of paragraphs.
 *
 * The brand-tinted rule down the start edge is what stops several of these
 * stacking into an undifferentiated wall of text on the guide pages.
 */
export default function ProseSection({ title, paragraphs, children, align = "start", className = "" }: ProseSectionProps) {
   return (
      <section className={`py-16 ${className}`}>
         <SectionHeading title={title} align={align} />

         <Reveal delay={0.08} className={align === "center" ? "mx-auto mt-8 max-w-3xl" : "mt-8 max-w-3xl"}>
            <div className="space-y-5 border-s-2 border-brand-500/30 ps-6">
               {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-navy-600 dark:text-navy-300">
                     {paragraph}
                  </p>
               ))}
            </div>
         </Reveal>

         {children ? <div className="mt-10">{children}</div> : null}
      </section>
   )
}
