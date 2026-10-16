"use client"

import { BanknotesIcon, BoltIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import SectionHeading from "@/app/components/ui/SectionHeading"
import CardGrid, { type CardGridItem } from "@/app/components/info/CardGrid"
import { fa } from "@/app/lib/i18n/fa"

const VALUES: CardGridItem[] = [
   { ...fa.info.about.values.authenticity, Icon: ShieldCheckIcon },
   { ...fa.info.about.values.transparency, Icon: BanknotesIcon },
   { ...fa.info.about.values.speed, Icon: BoltIcon },
   { ...fa.info.about.values.support, Icon: ChatBubbleLeftRightIcon },
]

/** The four principles the marketplace is run by, under the founding story. */
export default function AboutValues() {
   const copy = fa.info.about

   return (
      <section className="py-16">
         <SectionHeading title={copy.valuesTitle} subtitle={copy.valuesSubtitle} />
         <CardGrid className="mt-10" columns={4} items={VALUES} />
      </section>
   )
}
