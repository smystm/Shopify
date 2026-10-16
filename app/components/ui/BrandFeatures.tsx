"use client"

import FeatureGrid from "@/app/components/ui/FeatureGrid"
import { BRAND_FEATURES } from "@/app/lib/brandFeatures"
import { fa } from "@/app/lib/i18n/fa"

interface BrandFeaturesProps {
   title?: string
   subtitle?: string
}

/**
 * The four brand promises, with their icons attached.
 *
 * The `"use client"` directive is load-bearing rather than incidental: an icon
 * is a component reference (a `forward_ref` object), and React cannot serialise
 * those across the server/client boundary. Assembling the icon list on the
 * server and passing it down as a prop blows up at render time with "Functions
 * cannot be passed directly to Client Components". Keeping the assembly on the
 * client side of the boundary is what makes this usable from a server page.
 */
export default function BrandFeatures({ title = fa.features.title, subtitle = fa.features.subtitle }: BrandFeaturesProps) {
   return <FeatureGrid title={title} subtitle={subtitle} items={BRAND_FEATURES} />
}
