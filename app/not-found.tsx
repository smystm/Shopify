import Link from "next/link"

export default function NotFound() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
         <h1 className="text-6xl font-bold text-zinc-950 dark:text-white">404</h1>
         <p className="mt-4 text-lg text-zinc-500">Page not found</p>
         <Link
            href="/"
            className="mt-8 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
         >
            Go home
         </Link>
      </div>
   )
}
