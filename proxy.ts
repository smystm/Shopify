import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TOKEN_KEY = "shopy-token"
const USER_KEY = "shopy-user"

/**
 * Is this cookie actually a live session, or just a leftover?
 *
 * The original question here was "does the cookie exist", and that is not the same
 * question. A `shopy-token` outlives its own validity: it is written for ten days,
 * and the API rejects it the moment its `exp` passes. Answering "yes" to a cookie
 * that has expired is what locked people out. `/login` saw a cookie, decided they
 * were signed in, and bounced them to `/panel` - where every API call answered 401
 * or 403 and there was no way back to the sign-in form. The only escape was
 * clearing cookies by hand. Ten days after signing up, with no warning.
 *
 * The payload is read rather than verified, deliberately. This runs in the edge
 * runtime with no signing key, and it does not need one: it is only deciding which
 * page to show. A forged token can slip past this check and reach the panel, and
 * the backend then verifies that same token properly on every call and refuses it.
 * Reading `exp` here buys correct routing; it grants nothing.
 */
function hasLiveSession(token: string | undefined): boolean {
   if (!token) return false

   const parts = token.split(".")
   if (parts.length !== 3) return false

   try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
         exp?: number
      }

      // No expiry claim at all is not a shape this backend issues, so a token that
      // omits it is treated as unusable rather than granted access on a technicality.
      if (typeof payload.exp !== "number") return false

      return payload.exp * 1000 > Date.now()
   } catch {
      return false
   }
}

/** Drop a session the backend will not honour, so the browser stops sending it. */
function forgetSession(response: NextResponse): NextResponse {
   // Both, not just the token: `shopy-user` is what Redux rehydrates the "signed
   // in" header from, so leaving it behind would keep showing a name to someone who
   // is no longer signed in.
   for (const name of [TOKEN_KEY, USER_KEY]) {
      response.cookies.set(name, "", { path: "/", maxAge: 0, expires: new Date(0) })
   }
   return response
}

// Guest-only routes: signed-in users (live token) are sent to /panel.
// /login/verify is included: a user mid-verification has no shopy-token yet,
// so they can still access it, while signed-in users are redirected away.
const GUEST_ONLY = ["/login", "/register", "/login/verify"]

const PROTECTED_PREFIX = "/panel"
const ADMIN_PREFIX = "/admin"

export function proxy(request: NextRequest) {
   const token = request.cookies.get(TOKEN_KEY)?.value
   const { pathname } = request.nextUrl

   const isGuestOnly = GUEST_ONLY.includes(pathname)
   const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`)
   const isAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)

   const signedIn = hasLiveSession(token)
   // A cookie that is present but dead is worse than no cookie at all - it is what
   // produced the lockout - so clear it on the way past.
   const stale = Boolean(token) && !signedIn

   // Signed in but trying to visit login/register/verify -> dashboard
   if (isGuestOnly && signedIn) {
      return NextResponse.redirect(new URL("/panel", request.url))
   }

   // Guest trying to visit panel or admin -> login
   if ((isProtected || isAdmin) && !signedIn) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      return stale ? forgetSession(response) : response
   }

   const response = NextResponse.next()
   return stale ? forgetSession(response) : response
}

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
