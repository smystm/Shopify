import type { NextRequest } from "next/server"

/**
 * The shop's back channel to the Express API.
 *
 * Every `/api/*` call that is not `/api/login` or `/api/logout` lands here and is
 * forwarded to `BACKEND_API_URL`. The point is not to save a round trip - it is to
 * keep the browser on a single origin, so that:
 *
 *   1. The `shopy-token` cookie is first-party and so rides along automatically,
 *      and can stay `httpOnly`. Handed straight to a different domain it would be
 *      dropped as third-party, and JavaScript cannot re-add it because it is
 *      `httpOnly` - which logs everybody out.
 *   2. There is no CORS preflight and no `SameSite=None` juggling.
 *   3. `BACKEND_API_URL` never has to reach the client bundle, so it can stay a
 *      server-only variable and needs no `NEXT_PUBLIC_` prefix.
 *
 * `app/api/login` and `app/api/logout` still win over this catch-all, because Next
 * prefers a static segment to a catch-all, and they are left exactly as they are.
 */

/** Nothing here should ever be cached: a stale price is a wrong price. */
export const dynamic = "force-dynamic"

/** Vercel Hobby caps a function well below this; the ceiling costs nothing. */
export const maxDuration = 30

const BACKEND = (process.env.BACKEND_API_URL ?? "http://localhost:5000/api").replace(/\/+$/, "")

/**
 * Headers that describe *this* connection rather than the message, and so must not
 * be copied across. `content-length` is recomputed from the body we send, and
 * `accept-encoding` is left to the runtime so that it can decompress the reply for
 * us - which is also why `content-encoding` is dropped on the way back.
 */
const HOP_BY_HOP = new Set([
   "host",
   "connection",
   "keep-alive",
   "transfer-encoding",
   "te",
   "trailer",
   "upgrade",
   "proxy-authorization",
   "proxy-authenticate",
   "content-length",
   "accept-encoding",
])

async function proxy(request: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
   await ctx.params

   // `request.nextUrl.pathname` is used rather than `params.path` so that any
   // percent-encoding in a path segment survives the trip untouched.
   const pathname = request.nextUrl.pathname.replace(/^\/api(?=\/|$)/, "")
   const target = `${BACKEND}${pathname}${request.nextUrl.search}`

   const headers = new Headers()
   request.headers.forEach((value, key) => {
      if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
   })

   const hasBody = request.method !== "GET" && request.method !== "HEAD"
   const body = hasBody ? await request.arrayBuffer() : undefined

   let upstream: Response
   try {
      upstream = await fetch(target, {
         method: request.method,
         headers,
         body,
         // The backend answers 302 for Steam sign-in and for a finished top-up,
         // both of which must send the *browser* onwards. Following them here
         // would return Steam's HTML as our own 200.
         redirect: "manual",
         cache: "no-store",
      })
   } catch {
      // The backend being down or unreachable is a gateway problem, not a shop
      // error, and it is worth saying so: the callers branch on `code`, and
      // anything they do not recognise falls back to a generic message.
      return Response.json(
         {
            code: "UPSTREAM_UNREACHABLE",
            message: `Could not reach the backend at ${BACKEND}`,
         },
         { status: 502 },
      )
   }

   const responseHeaders = new Headers()
   upstream.headers.forEach((value, key) => {
      const name = key.toLowerCase()
      if (name === "set-cookie") return
      // The body we are about to hand on has already been decoded, so passing
      // these through would tell the browser to decode it a second time.
      if (name === "content-encoding" || name === "content-length") return
      responseHeaders.set(key, value)
   })

   // Nothing in the API sets a cookie today. Relaying it anyway costs two lines
   // and means a future endpoint that does is not silently invisible to the shop.
   const cookies =
      typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : []
   for (const cookie of cookies) responseHeaders.append("set-cookie", cookie)

   return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
   })
}

export {
   proxy as GET,
   proxy as POST,
   proxy as PUT,
   proxy as PATCH,
   proxy as DELETE,
   proxy as HEAD,
   proxy as OPTIONS,
}
