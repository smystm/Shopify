import { unstable_rethrow } from "next/navigation"
import SectionHeading from "@/app/components/ui/SectionHeading"
import StatStrip, { type StatStripItem } from "@/app/components/ui/StatStrip"
import { getCategories, getProducts } from "@/app/helpers/productApi"
import { fa } from "@/app/lib/i18n/fa"

/**
 * "شاپیفای در یک نگاه" - the counts behind the claims made above it.
 *
 * Fetched on the server and rendered as counted-from-data figures rather than
 * typed-in marketing numbers. If the catalogue cannot be reached the section is
 * dropped entirely: an about page that silently prints "0 محصول" is worse than
 * one that does not mention the catalogue at all.
 */
export default async function AboutStats() {
   const copy = fa.info.about

   let items: StatStripItem[] = []
   try {
      const [products, categories] = await Promise.all([getProducts(), getCategories()])
      const subcategories = new Set(products.map((product) => product.category?.subcategory).filter(Boolean))

      items = [
         { value: products.length.toLocaleString("en-US"), label: copy.statProducts },
         { value: categories.length.toLocaleString("en-US"), label: copy.statCategories },
         { value: subcategories.size.toLocaleString("en-US"), label: copy.statSubcategories },
      ]
   } catch (err) {
      // Next signals "this route must render per request" by throwing, so let its
      // own control-flow errors through before handling real failures here -
      // swallowing them makes the build try to bake this page statically.
      unstable_rethrow(err)
      console.error("About stats: catalogue unavailable", err)
      return null
   }

   return (
      <section className="py-16">
         <SectionHeading title={copy.statsTitle} subtitle={copy.statsSubtitle} />
         <StatStrip className="mt-10" columns={3} items={items} />
      </section>
   )
}
