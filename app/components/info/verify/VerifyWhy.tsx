"use client"

import { FingerPrintIcon, LifebuoyIcon, ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import SectionHeading from "@/app/components/ui/SectionHeading"
import CardGrid, { type CardGridItem } from "@/app/components/info/CardGrid"
import { fa } from "@/app/lib/i18n/fa"

const REASONS: CardGridItem[] = [
   { ...fa.info.verify.why.ownership, Icon: UserCircleIcon },
   { ...fa.info.verify.why.recovery, Icon: LifebuoyIcon },
   { ...fa.info.verify.why.fraud, Icon: FingerPrintIcon },
   { ...fa.info.verify.why.traceable, Icon: ShieldCheckIcon },
]

/** The four things phone verification actually buys, under the hero. */
export default function VerifyWhy() {
   const copy = fa.info.verify

   return (
      <section className="py-16">
         <SectionHeading title={copy.whyTitle} subtitle={copy.whySubtitle} />
         <CardGrid className="mt-10" columns={4} items={REASONS} />
      </section>
   )
}
