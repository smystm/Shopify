import Link from "next/link"
import type { ComponentType, SVGProps } from "react"
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, QuestionMarkCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import SectionHeading from "@/app/components/ui/SectionHeading"
import Reveal from "@/app/components/ui/Reveal"
import { SUPPORT_TELEGRAM_URL, supportMailtoHref } from "@/app/lib/support"
import { fa } from "@/app/lib/i18n/fa"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

interface Channel {
   title: string
   body: string
   action: string
   Icon: IconType
   href: string
   /** Opens in a new tab - used for anything that leaves the site. */
   external?: boolean
   /** The one channel we actually want people to use, styled to stand out. */
   featured?: boolean
}

/**
 * Support channels, ordered fastest-first.
 *
 * Only channels that genuinely work are listed: the email card is dropped from
 * the grid while `SUPPORT_EMAIL` is empty (see `supportMailtoHref`), so the page
 * never offers a route that dead-ends.
 */
export default function ContactChannels() {
   const copy = fa.info.contact

   const channels: Channel[] = [
      {
         ...copy.channels.telegram,
         Icon: ChatBubbleLeftRightIcon,
         href: SUPPORT_TELEGRAM_URL,
         external: true,
         featured: true,
      },
      {
         ...copy.channels.email,
         Icon: EnvelopeIcon,
         href: supportMailtoHref,
         external: true,
      },
      {
         ...copy.channels.panel,
         Icon: UserCircleIcon,
         href: "/panel/profile",
      },
      {
         ...copy.channels.faq,
         Icon: QuestionMarkCircleIcon,
         href: "/#faq",
      },
   ].filter((channel) => channel.href !== "")

   return (
      <section className="py-16">
         <SectionHeading title={copy.channelsTitle} subtitle={copy.channelsSubtitle} />

         <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map(({ title, body, action, Icon, href, external, featured }, i) => {
               const inner = (
                  <>
                     <span
                        className={
                           featured
                              ? "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110"
                              : "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-500/10 dark:text-brand-300"
                        }
                     >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                     </span>

                     <h3 className="mt-5 text-base font-bold text-navy-900 dark:text-white">{title}</h3>
                     <p className="mt-2 grow text-sm leading-7 text-navy-600 dark:text-navy-300">{body}</p>

                     <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300">
                        {action}
                        <ArrowLeftIcon
                           className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                           aria-hidden="true"
                        />
                     </span>
                  </>
               )

               const className = `group flex h-full flex-col rounded-2xl border bg-surface p-6 text-start shadow-md shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  featured
                     ? "border-brand-400/50 hover:border-brand-400 hover:shadow-brand-500/10 dark:border-brand-400/30"
                     : "border-border-strong hover:border-brand-400 hover:shadow-brand-500/5 dark:hover:border-brand-400/40"
               }`

               return (
                  <Reveal key={title} delay={i * 0.08} className="h-full">
                     {external ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                           {inner}
                        </a>
                     ) : (
                        <Link href={href} className={className}>
                           {inner}
                        </Link>
                     )}
                  </Reveal>
               )
            })}
         </div>
      </section>
   )
}
