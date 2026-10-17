/**
 * Which sign-in the shop is offering, and the URL to start it.
 *
 * Read by the storefront before anybody is signed in, which is the whole reason
 * it is a server call and not a build-time flag: the backend is the only place
 * that knows, and it is the place `AUTH_PROVIDER` is set.
 *
 * This is also what lets both providers ship at once. Nothing in the storefront
 * assumes Steam exists, and nothing has to be rebuilt to switch providers.
 */
import { API_BASE } from "@/app/lib/apiBase"

export type AuthProvider = "steam" | "phone"

export interface AuthMode {
   provider: AuthProvider
   /** True when Steam is the provider but has not been given its keys yet. */
   ready: boolean
}

export async function getAuthMode(): Promise<AuthMode> {
   try {
      const res = await fetch(`${API_BASE}/auth/mode`, { cache: "no-store" })
      if (!res.ok) throw new Error(`auth mode ${res.status}`)

      const body = (await res.json()) as { provider?: string }

      return { provider: body.provider === "steam" ? "steam" : "phone", ready: true }
   } catch {
      // The shop still has to render when the API is down, and the legacy form is
      // the safe default: it is what this storefront shipped with.
      return { provider: "phone", ready: false }
   }
}

/**
 * Where the Steam button sends the browser.
 *
 * A plain navigation, not fetch: the whole point is to leave for Steam, and doing
 * it client-side would only add a step that can fail. `STEAM_RETURN_URL` points
 * back at this app, so Steam lands on /auth/steam/callback.
 *
 * Spelled out as a relative path rather than built from `API_BASE`, and that is
 * not laziness. `API_BASE` is the absolute backend URL on the server and `/api` in
 * the browser, so an href built from it would be rendered one way and hydrated the
 * other - a mismatch React reports and the browser then overwrites. These two are
 * only ever used as an `href`, always in the browser, so they take the same value
 * in both places. The catch-all handler relays the redirect Steam sends back.
 */
export const STEAM_LOGIN_URL = "/api/auth/steam/login"

/** Same, for the "link Steam to my existing account" flow in the panel. */
export const STEAM_LINK_URL = "/api/auth/link"