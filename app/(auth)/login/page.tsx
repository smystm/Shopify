import Yokoso from "@/app/components/auth/Yokoso"
import AuthForm from "../../components/auth/AuthForm"

export const metadata = {
   title: "Log in — Shopify",
   description: "Log in to continue shopping.",
}

export default function LoginPage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <Yokoso headKoso="Shopify" paraKoso="Log in to continue shopping." />
         <AuthForm mode="login" />
      </div>
   )
}
