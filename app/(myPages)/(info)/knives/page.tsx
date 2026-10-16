import type { Metadata } from "next"
import CategoryLanding from "@/app/components/info/CategoryLanding"
import { fa } from "@/app/lib/i18n/fa"

const copy = fa.info.knives

export const metadata: Metadata = {
   title: `${copy.metaTitle} — ${fa.header.brand}`,
   description: copy.metaDescription,
}

/**
 * Landing page for the `knife` category.
 *
 * The page itself is one call into the shared template - the category value is
 * the only thing that distinguishes this from /gloves, and it has to match the
 * directory name that GET /api/categories reports.
 */
export default function KnivesPage() {
   return <CategoryLanding categoryValue="knife" copy={copy} />
}
