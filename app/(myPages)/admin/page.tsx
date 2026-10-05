import type { Metadata } from "next"

export const metadata: Metadata = {
   title: "Dashboard — Shopify Admin",
   description: "Admin dashboard — manage your store, products, and users.",
}

export default function page() {
   return (
      <div>
         <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Dashboard</h1>
         <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome to the admin workspace. Pick a section from the sidebar.
         </p>
      </div>
   )
}
