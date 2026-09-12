import React from "react"

interface AuthLayoutProps {
   children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
   return (
      <main className="min-h-screen w-full flex flex-col">
         {/* you can add some common layout elements here, like a header or footer, if needed */}
         {children}
      </main>
   )
}
