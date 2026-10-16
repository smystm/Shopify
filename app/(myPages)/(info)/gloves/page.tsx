import type { Metadata } from "next"
import CategoryLanding from "@/app/components/info/CategoryLanding"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.gloves

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * Landing page for the `gloves` category.
 *
 * Same template as /knives; the category value has to match the directory name
 * that GET /api/categories reports.
 */
export default function GlovesPage() {
   return <CategoryLanding categoryValue="gloves" copy={copy} />
}
