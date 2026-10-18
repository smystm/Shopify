import type { Metadata } from "next"
import { FolderIcon, UsersIcon, ClockIcon } from "@heroicons/react/24/outline"
import { fa } from "@/app/lib/i18n/fa"
import PageHero from "@/app/components/ui/PageHero"
import QuickActionTile from "@/app/components/ui/QuickActionTile"
import Reveal from "@/app/components/ui/Reveal"

export const metadata: Metadata = {
   title: fa.admin.dashboard.metaTitle,
   description: fa.admin.dashboard.metaDescription,
}

const QUICK_ACTIONS = [
   {
      key: "orders" as const,
      href: "/admin/orders",
      Icon: ClockIcon,
      hrefLabel: fa.admin.nav["/admin/orders"],
   },
   {
      key: "users" as const,
      href: "/admin/user",
      Icon: UsersIcon,
      hrefLabel: fa.admin.nav["/admin/user"],
   },
   {
      key: "products" as const,
      href: "/admin/products",
      Icon: FolderIcon,
      hrefLabel: fa.admin.nav["/admin/products"],
   },
]

export default function page() {
   return (
      <div>
         {/* Hero */}
         <PageHero badge={fa.admin.shellTitle} title={fa.admin.dashboard.title} description={fa.admin.dashboard.subtitle} />

         {/* Quick actions */}
         <section className="mt-10">
            <Reveal delay={0.08}>
               <h2 className="text-lg font-bold tracking-tight text-navy-950 dark:text-white">
                  {fa.admin.dashboard.quickActionsTitle}
               </h2>
               <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{fa.admin.dashboard.quickActionsSubtitle}</p>
            </Reveal>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
               {QUICK_ACTIONS.map(({ key, href, Icon, hrefLabel }, i) => (
                  <Reveal key={key} delay={0.12 + i * 0.08}>
                     <QuickActionTile
                        icon={<Icon className="h-6 w-6" aria-hidden="true" />}
                        title={fa.admin.dashboard.quickActions[key].title}
                        body={fa.admin.dashboard.quickActions[key].body}
                        cta={hrefLabel}
                        href={href}
                     />
                  </Reveal>
               ))}
            </div>
         </section>
      </div>
   )
}