import { ChartPieIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline"
import type { ComponentType, SVGProps } from "react"

export interface AdminNavItem {
   name: string
   href: string
   icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const adminNavigation: AdminNavItem[] = [
   { name: "Dashboard", href: "/admin", icon: HomeIcon },
   { name: "Users", href: "/admin/user", icon: UsersIcon },
   { name: "Products", href: "/admin/products", icon: FolderIcon },
   { name: "Documents", href: "/admin/documents", icon: DocumentDuplicateIcon },
   { name: "Reports", href: "/admin/reports", icon: ChartPieIcon },
]

export function isNavItemActive(itemHref: string, currentPath: string): boolean {
   if (itemHref === "/admin") return currentPath === "/admin"
   return currentPath === itemHref || currentPath.startsWith(`${itemHref}/`)
}
