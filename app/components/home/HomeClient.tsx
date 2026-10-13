"use client"

import { useAppSelector } from "@/app/lib/store/hooks"
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
   const isSignedIn = Boolean(user)
   const displayName = user?.name || user?.email || user?.phone || null

   return (
      <>
         <HeroSection displayName={displayName} />

         <Marquee />
         <Features />
         <CategoriesShowcase />
         <FeaturedSkins />
         <HowItWorks />
         <Faq />
         <CtaBand isSignedIn={isSignedIn} />
      </>
   )
}