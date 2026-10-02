export default function AccessDenied() {
   // Shown when the signed-in user's permission level blocks the page.
   return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
         <p className="text-sm font-semibold text-zinc-950 dark:text-white">Access denied</p>
         <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Your permission level does not allow you to view this admin section.
         </p>
      </div>
   )
}
