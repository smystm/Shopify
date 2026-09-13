import { NextResponse } from "next/server"

export async function POST() {
   const res = NextResponse.json({ ok: true })
   // Must use same path/sameSite/secure as login route,
   // otherwise the browser keeps the httpOnly cookie.
   res.cookies.set("shopy-token", "", {
      httpOnly: true,
      maxAge: 0,
      expires: new Date(0),
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
   })
   return res
}
