import { BanknotesIcon, BoltIcon, CheckBadgeIcon, LifebuoyIcon } from "@heroicons/react/24/outline"
import type { FeatureItem } from "@/app/components/ui/FeatureGrid"
import { fa } from "@/app/lib/i18n/fa"

/**
 * The brand promises with their icons attached, ready for `FeatureGrid`.
 *
 * The copy lives in `fa.features` (see FEATURE_ITEMS in the i18n file) and this
 * module only pairs each one with its icon, so the home page and the category
 * landing pages render the same four tiles from a single definition.
 */
export const BRAND_FEATURES: FeatureItem[] = [
   { ...fa.features.items.authentic, Icon: CheckBadgeIcon },
   { ...fa.features.items.fairPrice, Icon: BanknotesIcon },
   { ...fa.features.items.instantDelivery, Icon: BoltIcon },
   { ...fa.features.items.support, Icon: LifebuoyIcon },
]
