import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import "./globals.css"
import NotFoundShell from "@/app/components/ui/NotFoundShell"
import { themeInitScript } from "@/app/components/ThemeProvider"
import { fa } from "@/app/lib/i18n/fa"

// This file renders *instead of* the root layout for URLs that match no route
// at all, so it has to supply the font and the theme bootstrap itself.
const vazirmatn = Vazirmatn({
   variable: "--font-vazirmatn",
   // "arabic" is required — "latin" alone never loads Persian glyphs.
   subsets: ["arabic", "latin"],
})

export const metadata: Metadata = {
   title: fa.notFound.metaTitle,
   description: fa.notFound.metaDescription,
}

export default function GlobalNotFound() {
   return (
      <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
         <head>
            {/* Same anti-FOUC script as the root layout, so a dark-mode visitor
                never gets a white flash before React boots. */}
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
         </head>
         <body className="min-h-full">
            {/* No app router here, so the CTA does a full document navigation. */}
            <NotFoundShell navigation="hard" />
         </body>
      </html>
   )
}