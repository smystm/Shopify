import type { Metadata } from "next"
import YokosoUser from "@/app/components/panel/YokosoUser"

export const metadata: Metadata = {
   title: "My Panel — Shopify",
   description: "Your personal account panel — manage your profile and orders.",
}

export default function page() {
   return (
      <div>
         <YokosoUser />
      </div>
   )
}
