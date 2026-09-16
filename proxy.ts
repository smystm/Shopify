import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TOKEN_KEY = "shopy-token"

// Guest-only routes: logged-in users (token exists) are sent to /panel.
// /login/verify is included: a user mid-verification has no shopy-token yet,
// so they can still access it, while fully logged-in users are redirected away.
const GUEST_ONLY = ["/login", "/register", "/login/verify"]

const PROTECTED_PREFIX = "/panel"
const ADMIN_PREFIX = "/admin"

export function proxy(request: NextRequest) {
   const token = request.cookies.get(TOKEN_KEY)?.value
   const { pathname } = request.nextUrl

   const isGuestOnly = GUEST_ONLY.includes(pathname)
   const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`)
   const isAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)

   // Logged in but trying to visit login/register/verify -> dashboard
   if (isGuestOnly && token) {
      return NextResponse.redirect(new URL("/panel", request.url))
   }

   // Guest trying to visit panel or admin -> login
   if ((isProtected || isAdmin) && !token) {
      return NextResponse.redirect(new URL("/login", request.url))
   }

   return NextResponse.next()
}

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
