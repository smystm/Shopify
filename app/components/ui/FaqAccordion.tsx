"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import Reveal from "@/app/components/ui/Reveal"

export interface FaqItem {
   /** The question, rendered as the disclosure button label. */
   q: string
   /** The answer, revealed when the row is open. */
   a: string
}

interface FaqAccordionProps {
   items: readonly FaqItem[]
   title?: string
   subtitle?: string
   /**
    * Anchor target. The footer deep-links to `/#faq`, and `scroll-mt-24` keeps
    * the heading clear of the sticky header when it lands there.
    */
   id?: string
   className?: string
}

/**
 * Accordion of question/answer rows, used by the home page and every info page.
 *
 * Headless UI's Disclosure does the open/close state and the keyboard handling,
 * so each row is a real button rather than a div with a click handler.
 */
export default function FaqAccordion({ items, title, subtitle, id, className = "" }: FaqAccordionProps) {
   return (
      <section id={id} className={`scroll-mt-24 py-16 ${className}`}>
         {title ? (
            <Reveal className="mx-auto max-w-2xl text-center">
               <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">{title}</h2>
               {subtitle ? <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-300">{subtitle}</p> : null}
            </Reveal>
         ) : null}

         <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
            <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-md shadow-navy-900/5">
               {items.map((item) => (
                  <Disclosure key={item.q} as="div" className="group">
                     <DisclosureButton className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-sm font-bold text-navy-900 transition hover:bg-navy-100/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 dark:text-white dark:hover:bg-navy-800/50">
                        {item.q}
                        <PlusIcon className="h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 group-data-open:rotate-45" aria-hidden="true" />
                     </DisclosureButton>
                     <DisclosurePanel className="px-6 pb-5 text-sm leading-7 text-navy-600 dark:text-navy-300">{item.a}</DisclosurePanel>
                  </Disclosure>
               ))}
            </div>
         </Reveal>
      </section>
   )
}
