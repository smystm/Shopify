import type { Metadata } from "next"
import YokosoUser from "@/app/components/panel/YokosoUser"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.panel.metaTitle,
   description: fa.panel.metaDescription,
}

export default function page() {
   return (
      <div>
         <YokosoUser />
      </div>
   )
}
