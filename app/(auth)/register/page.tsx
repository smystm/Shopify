import Yokoso from "@/app/components/auth/Yokoso"
import AuthForm from "../../components/auth/AuthForm"

export const metadata = {
   title: "Create account — Shopify",
   description: "Create your Shopify account.",
}

export default function RegisterPage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <Yokoso headKoso="Shopify" paraKoso="Create your Shopify account." />
         <AuthForm mode="signup" />
      </div>
   )
}
