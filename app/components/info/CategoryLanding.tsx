import Link from "next/link"
import { unstable_rethrow } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import PageHero from "@/app/components/ui/PageHero"
import SectionHeading from "@/app/components/ui/SectionHeading"
import StatStrip from "@/app/components/ui/StatStrip"
import BrandFeatures from "@/app/components/ui/BrandFeatures"
import FaqAccordion from "@/app/components/ui/FaqAccordion"
import InfoCta from "@/app/components/ui/InfoCta"
import Reveal from "@/app/components/ui/Reveal"
import ProductCard from "@/app/components/products/ProductCard"
import ProseSection from "@/app/components/info/ProseSection"
import { categoryIconClass, categoryIconStyle, displayName, hasImage } from "@/app/lib/catalog"
import { getCategories, getProducts } from "@/app/helpers/productApi"
import { formatToman } from "@/app/lib/formatPrice"
import { fa } from "@/app/lib/i18n/fa"
import type { AdminProduct } from "@/app/contracts/products"

interface CategoryLandingCopy {
   badge: string
   heroTitle: string
   heroSubtitle: string
   guideTitle: string
   guideParagraphs: readonly string[]
   faqTitle: string
   faqSubtitle: string
   faq: Record<string, { q: string; a: string }>
   ctaTitle: string
   ctaSubtitle: string
}

interface CategoryLandingProps {
   /** Directory name from GET /api/categories, e.g. "knife". */
   categoryValue: string
   copy: CategoryLandingCopy
}

/** How many products the landing page previews before linking into the grid. */
const PREVIEW_COUNT = 8

/**
 * The shared template behind /knives and /gloves.
 *
 * Both pages are the same page with a different category: live stats, the
 * families inside the category, a preview of what is in stock, a buying guide,
 * the brand promises, an FAQ and a closing CTA. Writing it once and passing the
 * category in keeps the two from diverging, and the per-page `copy` carries the
 * only real difference - the words.
 *
 * Data comes from the server so the page never flashes an empty grid, and the
 * whole catalogue block is optional: if the backend is down the guide still
 * renders, which is the part that is actually unique to this page.
 */
export default async function CategoryLanding({ categoryValue, copy }: CategoryLandingProps) {
   const p = fa.info.categoryPage

   let products: AdminProduct[] = []
   let subcategories: string[] = []
   let catalogueFailed = false

   try {
      const [list, categories] = await Promise.all([
         getProducts({ filters: { categories: [categoryValue] } }),
         getCategories(),
      ])
      products = list
      subcategories = categories.find((category) => category.value === categoryValue)?.subcategories ?? []
   } catch (err) {
      // Next signals "this route must render per request" by throwing, so let its
      // own control-flow errors through before handling real failures here -
      // swallowing them makes the build try to bake this page statically.
      unstable_rethrow(err)
      // A backend outage must not take the buying guide down with it.
      console.error(`Category landing "${categoryValue}": catalogue unavailable`, err)
      catalogueFailed = true
   }

   // A card with no artwork renders as an empty box, and price is a TEXT column
   // so it has to survive a non-numeric value before it can be compared.
   const inStock = products.filter(hasImage)
   const prices = products.map((product) => Number(product.price)).filter((price) => Number.isFinite(price))
   const cheapest = prices.length > 0 ? Math.min(...prices) : null
   const priciest = prices.length > 0 ? Math.max(...prices) : null

   /** Both the preview's "see all" and the closing CTA land on the real grid. */
   const listHref = `/products?category=${encodeURIComponent(categoryValue)}`

   return (
      <>
         <PageHero title={copy.heroTitle} description={copy.heroSubtitle} badge={copy.badge} />

         {catalogueFailed ? (
            <Reveal className="mt-10">
               <p className="rounded-2xl border border-dashed border-navy-300 px-6 py-8 text-center text-sm text-navy-500 dark:border-navy-700 dark:text-navy-400">
                  {p.unavailable}
               </p>
            </Reveal>
         ) : (
            <>
               <StatStrip
                  className="mt-10"
                  columns={4}
                  items={[
                     { value: products.length.toLocaleString("en-US"), label: p.inStock },
                     { value: subcategories.length.toLocaleString("en-US"), label: p.families },
                     { value: cheapest === null ? "—" : formatToman(cheapest), label: p.cheapest },
                     { value: priciest === null ? "—" : formatToman(priciest), label: p.priciest },
                  ]}
               />

               {subcategories.length > 0 ? (
                  <section className="py-16">
                     <SectionHeading title={p.subcategoriesTitle} subtitle={p.subcategoriesSubtitle} />

                     <Reveal delay={0.08} className="mt-10 flex flex-wrap justify-center gap-3">
                        {subcategories.map((subcategory) => (
                           <Link
                              key={subcategory}
                              href={`${listHref}&subcategory=${encodeURIComponent(subcategory)}`}
                              className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold text-navy-700 shadow-sm transition-all duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-navy-100 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                           >
                              <span
                                 aria-hidden="true"
                                 className={`${categoryIconClass(categoryValue, "h-3.5 w-4")} text-brand-500`}
                                 style={categoryIconStyle(categoryValue)}
                              />
                              {displayName(subcategory)}
                              <ArrowLeftIcon
                                 className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 rtl:scale-x-[-1]"
                                 aria-hidden="true"
                              />
                           </Link>
                        ))}
                     </Reveal>
                  </section>
               ) : null}

               {inStock.length > 0 ? (
                  <section className="py-16">
                     <SectionHeading title={p.productsTitle} subtitle={p.productsSubtitle} />

                     <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {inStock.slice(0, PREVIEW_COUNT).map((product, i) => (
                           <ProductCard key={product.id} product={product} index={i} />
                        ))}
                     </div>

                     <Reveal delay={0.08} className="mt-10 flex justify-center">
                        <Link
                           href={listHref}
                           className="group inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-50/80 px-6 py-3 text-sm font-bold text-brand-700 transition-all duration-300 hover:border-transparent hover:bg-linear-to-l hover:from-brand-700 hover:to-brand-800 hover:text-white hover:shadow-lg hover:shadow-brand-700/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:text-white"
                        >
                           {p.productsCta}
                           <ArrowLeftIcon
                              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:scale-x-[-1] rtl:group-hover:translate-x-1"
                              aria-hidden="true"
                           />
                        </Link>
                     </Reveal>
                  </section>
               ) : (
                  <Reveal className="py-16">
                     <p className="rounded-2xl border border-dashed border-navy-300 px-6 py-10 text-center text-sm text-navy-500 dark:border-navy-700 dark:text-navy-400">
                        {p.productsEmpty}
                     </p>
                  </Reveal>
               )}
            </>
         )}

         <ProseSection title={copy.guideTitle} paragraphs={copy.guideParagraphs} />

         <BrandFeatures />

         <FaqAccordion title={copy.faqTitle} subtitle={copy.faqSubtitle} items={Object.values(copy.faq)} />

         <InfoCta
            title={copy.ctaTitle}
            subtitle={copy.ctaSubtitle}
            actions={[
               { label: p.ctaPrimary, href: listHref, tone: "primary" },
               { label: p.ctaSecondary, href: "/contact", tone: "ghost" },
            ]}
         />
      </>
   )
}
