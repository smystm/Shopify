import { BoltIcon } from "@heroicons/react/24/outline"
import InfoCta, { type CtaAction } from "@/app/components/ui/InfoCta"
import { fa } from "@/app/lib/i18n/fa"

interface CtaBandProps {
   isSignedIn: boolean
}

export default function CtaBand({ isSignedIn }: CtaBandProps) {
   const actions: CtaAction[] = [
      { label: fa.home.finalCta.primary, href: "/products", tone: "primary" },
      isSignedIn
         ? {
              label: fa.home.finalCta.panel,
              href: "/panel",
              tone: "accent",
              icon: <BoltIcon className="h-4 w-4" aria-hidden="true" />,
           }
         : { label: fa.home.finalCta.secondary, href: "/register", tone: "ghost" },
   ]

   return <InfoCta title={fa.home.finalCta.title} subtitle={fa.home.finalCta.subtitle} actions={actions} />
}
