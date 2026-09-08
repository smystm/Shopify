import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">🛍️ Shopify</h1>
      <p className="mb-8 text-sm text-zinc-500">Your e-commerce starter</p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
