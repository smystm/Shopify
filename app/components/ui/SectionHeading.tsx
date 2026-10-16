import Reveal from "@/app/components/ui/Reveal"

interface SectionHeadingProps {
   title: string
   subtitle?: string
   /**
    * "center" for a section that owns the full width, "start" when the heading
    * sits above a grid or beside other content.
    */
   align?: "center" | "start"
   /** Rendered as h3 when the section nests under another h2. */
   as?: "h2" | "h3"
   className?: string
}

/**
 * The reveal-on-scroll heading block every section opens with.
 *
 * Extracted because the same three lines - Reveal wrapper, 3xl heading, muted
 * subtitle - were repeated in every home section and would otherwise have been
 * repeated again on all seven info pages.
 */
export default function SectionHeading({ title, subtitle, align = "center", as = "h2", className = "" }: SectionHeadingProps) {
   const Heading = as

   return (
      <Reveal className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
         <Heading className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{title}</Heading>
         {subtitle ? <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{subtitle}</p> : null}
      </Reveal>
   )
}
