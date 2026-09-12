"use client"
import React from "react"
import useAuth from "../lib/store/useAuth"

interface PanelLayoutProps {
   children: React.ReactNode
}

export default function PanelLayout({ children }: PanelLayoutProps) {
   const { user, error, loading } = useAuth()

   if (loading) {
      return <div>loading</div>
   }

   if (error) {
      return <div>error</div>
   }

   console.log(user)

   return (
      <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
         <header className="mb-8">
            <h1 className="text-3xl font-bold">My App</h1>
         </header>
         <main className="flex w-full max-w-md flex-1 flex-col items-center text-2xl">{children}</main>
      </div>
   )
}
