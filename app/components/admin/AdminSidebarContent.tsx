import Link from "next/link"
import { adminNavigation, isNavItemActive } from "./adminNavigation"

function classNames(...classes: Array<string | false | null | undefined>): string {
   return classes.filter(Boolean).join(" ")
}

interface AdminSidebarContentProps {
   currentPath: string
   onNavigate?: () => void
}

export default function AdminSidebarContent({ currentPath, onNavigate }: AdminSidebarContentProps) {
   return (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
         <div className="flex h-16 shrink-0 items-center">
            <Link href="/admin" onClick={onNavigate} className="flex items-center gap-x-2.5">
               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white dark:bg-white dark:text-zinc-950">
                  S
               </span>
               <span className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                  Shopify Admin
               </span>
            </Link>
         </div>
         <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
               <li>
                  <ul role="list" className="-mx-2 space-y-1">
                     {adminNavigation.map((item) => {
                        const active = isNavItemActive(item.href, currentPath)
                        return (
                           <li key={item.name}>
                              <Link
                                 href={item.href}
                                 onClick={onNavigate}
                                 className={classNames(
                                    active
                                       ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white"
                                       : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-white",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                                 )}
                              >
                                 <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                       active
                                          ? "text-zinc-950 dark:text-white"
                                          : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
                                       "h-6 w-6 shrink-0",
                                    )}
                                 />
                                 {item.name}
                              </Link>
                           </li>
                        )
                     })}
                  </ul>
               </li>
               <li className="mt-auto">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                     <p className="font-semibold text-zinc-700 dark:text-zinc-200">Admin workspace</p>
                     <p className="mt-1">Manage your store, team and reports from one place.</p>
                  </div>
               </li>
            </ul>
         </nav>
      </div>
   )
}
