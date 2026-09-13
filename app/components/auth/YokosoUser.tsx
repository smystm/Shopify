"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCookies } from "react-cookie"
import { logout } from "../../lib/store/authSlice"
import { removeLoginAuth } from "../../helpers/auth"
import { useRouter } from "next/navigation"

export default function YokosoUser() {
   const user = useSelector((state: any) => state.auth.user)
   const dispatch = useDispatch()
   const [, , removeCookie] = useCookies(["shopy-token", "shopy-user"])
   const router = useRouter()
   const handleLogout = () => {
      removeCookie("shopy-token", { path: "/" })
      removeCookie("shopy-user", { path: "/" })
      removeLoginAuth()
      dispatch(logout())
      router.push("/")
   }

   return (
      <div className="flex flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user.name || user.email}! 🎉</h1>
            <p className="mt-2 text-sm text-zinc-500">You are logged in as {user.email || user.phone}</p>
            <button
               onClick={handleLogout}
               className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
               Log out
            </button>
         </div>
      </div>
   )
}
