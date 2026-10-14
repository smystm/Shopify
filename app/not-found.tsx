import type { Metadata } from "next"
import NotFoundShell from "@/app/components/ui/NotFoundShell"
import { fa } from "@/app/lib/i18n/fa"

export const metadata: Metadata = {
   title: fa.notFound.metaTitle,
   description: fa.notFound.metaDescription,
}

/**
 * 404 for unmatched routes *inside* the app router. Rendered inside the root
 * layout, so it inherits the Vazirmatn font, Providers and the theme script.
 */
export default function NotFound() {
   return <NotFoundShell />
}