import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Vazirmatn  } from "next/font/google"
import "./globals.css"
import Providers from "@/app/components/Providers"
import { themeInitScript } from "@/app/components/ThemeProvider"

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
})

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
})

const vazirmatn = Vazirmatn({
   variable: "--font-vazirmatn",
   // "arabic" is required — "latin" alone never loads Persian glyphs.
   subsets: ["arabic", "latin"],
})

export const metadata: Metadata = {
   metadataBase: new URL("https://biashopify.vercel.app"),
   title: {
      default: "BiaStore | خرید امن اسکین CS2 و کلید TF2",
      template: "%s | BiaStore",
   },
   description:
      "بیااستور، بازار ایرانی خرید و فروش اسکین CS2 و کلید TF2؛ با کیف پول تومانی، قیمت‌گذاری شفاف، تصاویر واقعی و تحویل مستقیم به لینک ترید استیم.",
   keywords: ["خرید اسکین CS2", "خرید کلید TF2", "اسکین کانتر استرایک", "خرید پرایم CS2", "بیااستور"],
   openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: "BiaStore",
      title: "BiaStore | خرید امن اسکین CS2 و کلید TF2",
      description: "بازار ایرانی اسکین CS2 و کلید TF2 با کیف پول تومانی و تحویل مستقیم به لینک ترید استیم.",
      url: "/",
   },
   twitter: {
      card: "summary_large_image",
      title: "BiaStore | خرید امن اسکین CS2 و کلید TF2",
      description: "بازار ایرانی اسکین CS2 و کلید TF2 با کیف پول تومانی و تحویل مستقیم به لینک ترید استیم.",
   },
}

export const viewport: Viewport = {
   width: "device-width",
   initialScale: 1,
   // Matches the page background so mobile browser chrome blends in.
   themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
      { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
   ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="fa" dir="rtl" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}>
         <head>
            {/* Runs before paint so dark-mode visitors never see a white flash. */}
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
         </head>
         <body className="min-h-full flex flex-col">
            <Providers>{children}</Providers>
         </body>
      </html>
   )
}
