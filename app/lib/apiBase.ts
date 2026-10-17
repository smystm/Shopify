/**
 * Where the shop talks to the backend.
 *
 * One rule, two answers:
 *
 * - **In the browser**: always the relative `/api`. That path is served by this
 *   app's own catch-all route handler, which forwards the call to the backend and
 *   hands back the reply. The browser therefore only ever sees one origin.
 *
 * - **On the server**: straight to the backend, skipping the round trip through
 *   our own route handler.
 *
 * Why the browser goes through the handler rather than calling the backend
 * directly: the session token lives in the `shopy-token` cookie, which is
 * `httpOnly`. JavaScript cannot read it, so a browser-to-backend call carries no
 * `Authorization` header - it only works while the cookie happens to ride along
 * because both hosts are `localhost`. The moment the shop is deployed to two
 * different domains, every authenticated call answers 401. The handler reads the
 * cookie server-side (where `httpOnly` is no obstacle) and forwards it, so the
 * token stays out of reach of scripts while still reaching the backend.
 *
 * Note this means CORS and cross-site cookie rules never come into play, in
 * development or in production: both are same-origin by construction.
 */
export const API_BASE =
   typeof window === "undefined"
      ? (process.env.BACKEND_API_URL ?? "http://localhost:5000/api")
      : "/api"
