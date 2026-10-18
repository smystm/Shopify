import type { Metadata } from "next"
import { HeartIcon } from "@heroicons/react/24/outline"
import PanelComingSoon from "@/app/components/panel/PanelComingSoon"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.wishlist.title,
   description: fa.panel.wishlist.subtitle,
}

export default function PanelWishlistPage() {
   return (
      <PanelComingSoon
         icon={<HeartIcon className="h-6 w-6" aria-hidden="true" />}
         title={fa.panel.wishlist.title}
         subtitle={fa.panel.wishlist.subtitle}
         body={fa.panel.wishlist.emptyBody}
      />
   )
}