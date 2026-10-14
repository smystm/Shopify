"use client"

import { useEffect, useState } from "react"
import {
   Squares2X2Icon,
   ShoppingBagIcon,
   ArrowsRightLeftIcon,
   WalletIcon,
   HeartIcon,
   ArchiveBoxIcon,
   UserCircleIcon,
   LifebuoyIcon,
} from "@heroicons/react/24/outline"
import PanelTabs, { type PanelTabItem } from "@/app/components/ui/PanelTabs"
import { getOrders, getTradeOffers } from "@/app/helpers/panelApi"
import { fa } from "@/app/lib/i18n/fa"

/**
 * Tab bar for the customer panel, rendered once by the panel layout.
 *
 * Counts for orders and pending trade offers are fetched here so every
 * sub-page shows them without each one repeating the request.
 */
export default function PanelNav() {
   const [ordersTotal, setOrdersTotal] = useState<number | undefined>(undefined)
   const [pendingOffers, setPendingOffers] = useState<number | undefined>(undefined)

   useEffect(() => {
      let cancelled = false

      // Failures leave the badge off rather than showing a wrong number.
      getOrders()
         .then((res) => {
            if (!cancelled) setOrdersTotal(res.summary.total)
         })
         .catch(() => {})

      getTradeOffers()
         .then((res) => {
            if (!cancelled) setPendingOffers(res.pendingCount)
         })
         .catch(() => {})

      return () => {
         cancelled = true
      }
   }, [])

   const items: PanelTabItem[] = [
      {
         href: "/panel",
         label: fa.panel.tabs.overview,
         icon: <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/orders",
         label: fa.panel.tabs.orders,
         count: ordersTotal,
         icon: <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/offers",
         label: fa.panel.tabs.offers,
         count: pendingOffers,
         icon: <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/wallet",
         label: fa.panel.tabs.wallet,
         icon: <WalletIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/wishlist",
         label: fa.panel.tabs.wishlist,
         icon: <HeartIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/inventory",
         label: fa.panel.tabs.inventory,
         icon: <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/profile",
         label: fa.panel.tabs.profile,
         icon: <UserCircleIcon className="h-5 w-5" aria-hidden="true" />,
      },
      {
         href: "/panel/tickets",
         label: fa.panel.tabs.tickets,
         icon: <LifebuoyIcon className="h-5 w-5" aria-hidden="true" />,
      },
   ]

   return <PanelTabs items={items} label={fa.panel.tabs.label} className="mb-8" />
}