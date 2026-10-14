import type { ReactNode } from "react"
import PageHero from "@/app/components/ui/PageHero"
import EmptyState from "@/app/components/ui/EmptyState"
import Reveal from "@/app/components/ui/Reveal"
import { fa } from "@/app/lib/i18n/fa"

interface ComingSoonProps {
   icon: ReactNode
   title: string
   subtitle: string
   body: string
}

/**
 * Placeholder for a public route the footer links to but that is not built yet.
 *
 * The panel equivalent is `PanelComingSoon`; this one is the public-page
 * version, using PageHero so it matches the marketing pages rather than a tab.
 * Rendering a real page beats a 404 — every footer link resolves to something.
 *
 * The panel state can repeat its title because it sits under a tab label; a
 * standalone page cannot, so the panel says "به‌زودی" instead.
 */
export default function ComingSoon({ icon, title, subtitle, body }: ComingSoonProps) {
   return (
      <>
         <PageHero title={title} description={subtitle} />

         <Reveal delay={0.08} className="mt-10">
            <EmptyState icon={icon} title={fa.comingSoon.heading} body={body} tone="accent" />
         </Reveal>
      </>
   )
}
