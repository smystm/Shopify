import type { Metadata } from "next"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.admin.dashboard.metaTitle,
   description: fa.admin.dashboard.metaDescription,
}

export default function page() {
   return (
      <div>
         <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">{fa.admin.dashboard.title}</h1>
         <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {fa.admin.dashboard.subtitle}
         </p>
      </div>
   )
}
