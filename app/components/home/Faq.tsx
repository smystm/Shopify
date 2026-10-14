"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import Reveal from "@/app/components/ui/Reveal"

const ITEMS = ["authenticity", "payment", "delivery", "refund"] as const

export default function Faq() {
   return (
      <section className="py-16">
         <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{fa.home.faq.title}</h2>
            <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{fa.home.faq.subtitle}</p>
         </Reveal>

         <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
            <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
               {ITEMS.map((key) => (
                  <Disclosure key={key} as="div" className="group">
                     <DisclosureButton className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-sm font-bold text-navy-900 transition hover:bg-navy-100/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 dark:text-white dark:hover:bg-navy-800/50">
                        {fa.home.faq.items[key].q}
                        <PlusIcon className="h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 group-data-open:rotate-45" aria-hidden="true" />
                     </DisclosureButton>
                     <DisclosurePanel className="px-6 pb-5 text-sm leading-7 text-navy-600 dark:text-navy-300">
                        {fa.home.faq.items[key].a}
                     </DisclosurePanel>
                  </Disclosure>
               ))}
            </div>
         </Reveal>
      </section>
   )
}