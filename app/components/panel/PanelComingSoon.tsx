import type { ReactNode } from "react"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"

interface PanelComingSoonProps {
   icon: ReactNode
   title: string
   subtitle: string
   body: string
}

/**
 * Placeholder shell for a panel tab whose screen is not built yet.
 *
 * Renders a branded empty state rather than a 404 so the tab bar never
 * dead-ends. Each of these tabs has a full API and copy behind it — only the
 * UI is pending.
 */
export default function PanelComingSoon({ icon, title, subtitle, body }: PanelComingSoonProps) {
   return (
      <div>
         <Reveal>
            <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{title}</h1>
            <p className="mt-2 text-[15px] leading-7 text-navy-600 dark:text-navy-300">{subtitle}</p>
         </Reveal>

         <div className="mt-8">
            <EmptyState icon={icon} title={title} body={body} tone="accent" />
         </div>
      </div>
   )
}