"use client"

import { useAppSelector } from "@/app/lib/store/hooks"
import { useMounted } from "@/app/lib/hooks/useMounted"
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