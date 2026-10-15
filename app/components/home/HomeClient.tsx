"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppSelector } from "@/app/lib/store/hooks"
import { useMounted } from "@/app/lib/hooks/useMounted"
import { getProducts, getCategories } from "@/app/helpers/productApi"
import type { AdminProduct, Category } from "@/app/contracts/products"
import HeroSection from "./HeroSection"
import Marquee from "./Marquee"
import Features from "./Features"
import CategoriesShowcase from "./CategoriesShowcase"
import FeaturedSkins from "./FeaturedSkins"
import HowItWorks from "./HowItWorks"
import Faq from "./Faq"
import CtaBand from "./CtaBand"

/**
 * The landing page always renders — signed in or not.
 * Only the auth-specific CTAs differ, so returning users keep seeing the
 * full marketing page instead of being dropped onto the panel card.
 */
export default function HomeClient() {
   const user = useAppSelector((s) => s.auth.user)

   // Gated on this component's own hydration: the page is server-rendered, and
   // reading `user` alone lets the client render a personalised hero while the
   // server rendered the generic one. See the note in SiteHeader.
   const mounted = useMounted()
   const isSignedIn = mounted && Boolean(user)
   const displayName = isSignedIn ? user?.name || user?.email || user?.phone || null : null

   // One fetch for the whole page. The three data-driven sections all need the
   // same catalogue, so fetching per-section would triple the request count for
   // identical data.
   const [products, setProducts] = useState<AdminProduct[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [catalogueState, setCatalogueState] = useState<"loading" | "ready" | "error">("loading")

   useEffect(() => {
      let cancelled = false

      Promise.all([getProducts(), getCategories()])
         .then(([productList, categoryList]) => {
            if (cancelled) return
            setProducts(productList)
            setCategories(categoryList)
            setCatalogueState("ready")
         })
         .catch((err) => {
            console.error("Failed to load the home catalogue:", err)
            if (cancelled) return
            setCatalogueState("error")
         })

      return () => {
         cancelled = true
      }
   }, [])

   // Newest first. There are no orders yet, so "best-selling" would be fiction;
   // recency is the one ordering the database can actually support.
   const newestFirst = useMemo(() => [...products].sort((a, b) => b.id - a.id), [products])

   const loading = catalogueState === "loading"

   return (
      <>
         <HeroSection displayName={displayName} products={newestFirst} loading={loading} />

         <Marquee categories={categories} />
         <Features />
         <CategoriesShowcase categories={categories} products={newestFirst} loading={loading} />
         <FeaturedSkins products={newestFirst} loading={loading} />
         <HowItWorks />
         <Faq />
         <CtaBand isSignedIn={isSignedIn} />
      </>
   )
}
