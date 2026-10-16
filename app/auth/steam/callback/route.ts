import { NextRequest, NextResponse } from "next/server"

/**
 * Where Steam sends the browser back to.
 *
 * STEAM_RETURN_URL points here, so the OpenID response lands on the storefront's
 * own origin. That is deliberate: this route is the only thing that ever holds
 * the signed JWT, and it turns that straight into an HttpOnly cookie - the same
 * one `app/api/login/route.ts` writes for the phone flow. A JWT never travels
 * through a URL, a referrer header or the browser history, and no frontend code
 * ever sees it.
 *
 * It does the one server-to-server call to the backend, which is where the
 * OpenID response is actually verified against Steam.
 *
 * Only mounted when AUTH_PROVIDER=steam; until then nothing points here.
 */

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:5000/api"

/** Where a completed sign-in lands. The panel, because that is the shop's home. */
const SUCCESS = "/panel"
const FAILURE = "/login?steam=failed"

/** Steam can append its own parameters; only ours matter. */
function pick(params: URLSearchParams) {
   return {
      state: params.get("state") ?? undefined,
      "openid.ns": params.get("openid.ns") ?? undefined,
      "openid.mode": params.get("openid.mode") ?? undefined,
      "openid.op_endpoint": params.get("openid.op_endpoint") ?? undefined,
      "openid.claimed_id": params.get("openid.claimed_id") ?? undefined,
      "openid.identity": params.get("openid.identity") ?? undefined,
      "openid.return_to": params.get("openid.return_to") ?? undefined,
      "openid.response_nonce": params.get("openid.response_nonce") ?? undefined,
      "openid.assoc_handle": params.get("openid.assoc_handle") ?? undefined,
      "openid.signed": params.get("openid.signed") ?? undefined,
      "openid.sig": params.get("openid.sig") ?? undefined,
   }
}

export async function GET(request: NextRequest) {
   const body = pick(request.nextUrl.searchParams)

   let response: Response
   try {
      response = await fetch(`${API_BASE}/auth/steam/exchange`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(body),
         cache: "no-store",
      })
   } catch {
      return NextResponse.redirect(new URL(FAILURE, request.url))
   }

   if (!response.ok) return NextResponse.redirect(new URL(FAILURE, request.url))

   const payload = (await response.json()) as { token?: string; user?: Record<string, unknown> }
   if (!payload?.token) return NextResponse.redirect(new URL(FAILURE, request.url))

   const redirect = NextResponse.redirect(new URL(SUCCESS, request.url))

   // Identical attributes to the phone flow's cookie, so nothing downstream -
   // proxy.ts, the (auth) layout, AuthHydrator - has to know which provider
   // produced the session.
   redirect.cookies.set("shopy-token", payload.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 10,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
   })

   if (payload.user) {
      // Readable on purpose: the header shows a Steam picture and name before the
      // first /user call resolves. It holds no secret - the token above is the
      // only credential, and this one cannot authorise anything.
      redirect.cookies.set("shopy-user", JSON.stringify(payload.user), {
         maxAge: 60 * 60 * 24 * 10,
         sameSite: "lax",
         path: "/",
         secure: process.env.NODE_ENV === "production",
      })
   }

   return redirect
}