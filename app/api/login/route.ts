import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const token = body?.token

      if (!token || typeof token !== "string") {
         return NextResponse.json({ error: "missing token" }, { status: 400 })
      }

      const res = NextResponse.json({ ok: true })
      res.cookies.set("shopy-token", token, {
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 10,
         sameSite: "lax",
         path: "/",
         secure: process.env.NODE_ENV === "production",
      })
      return res
   } catch {
      return NextResponse.json({ error: "invalid body" }, { status: 400 })
   }
}
