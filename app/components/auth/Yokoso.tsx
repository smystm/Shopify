import React from "react"

interface YokosoProps {
  // Add any props if needed in the future
  paraKoso?: string,
  headKoso: string
}

export default function Yokoso({ paraKoso, headKoso }: YokosoProps) {
   return (
      <>
         <h1 className="mb-2 text-3xl font-bold tracking-tight flex items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5 8h14l1 13H4L5 8Z" fill="#F5F5F5" />
               <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
               <path d="M5 8h14l1 13H4L5 8Z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
               <path d="M7 12h10v5H7z" fill="#A78BFA" opacity=".35" />
            </svg>
            {headKoso ? headKoso : "Shopify"}
         </h1>
         <p className="mb-8 text-sm text-zinc-500">{paraKoso}</p>
      </>
   )
}
