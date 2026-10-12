"use client"

import { useAppSelector } from "@/app/lib/store/hooks"
import YokosoUser from "@/app/components/panel/YokosoUser"
import HeroSection from "./HeroSection"

export default function HomeClient() {
   const user = useAppSelector((s) => s.auth.user)

   if (user) return <YokosoUser />

   return <HeroSection />
}
