import Cookies from "universal-cookie"
import type { AuthUser } from "@/app/lib/store/authSlice"

const TOKEN_KEY = "shopy-token"
const USER_KEY = "shopy-user"

const getCookies = () => new Cookies()

const storeLoginToken = (token: string, day: number = 10) => {
   // day: number of days until the cookie expires. Default is 10 days.
   if (!token) return
   getCookies().set(TOKEN_KEY, token, { path: "/", maxAge: 3600 * 24 * day, sameSite: "lax" })
}

const getLoginToken = (): string | undefined => {
   return getCookies().get<string>(TOKEN_KEY)
}

/** Persist the logged-in user next to the token so Redux can be rehydrated after a refresh. */
const storeLoginUser = (user: AuthUser, day: number = 10) => {
   getCookies().set(USER_KEY, JSON.stringify(user), { path: "/", maxAge: 3600 * 24 * day, sameSite: "lax" })
}

const getLoginUser = (): AuthUser | null => {
   const raw = getCookies().get(USER_KEY) as AuthUser | string | undefined
   if (!raw) return null
   try {
      const user = typeof raw === "string" ? (JSON.parse(raw) as AuthUser) : raw
      if (user && (user.name || user.email || user.phone)) return user
      return null
   } catch {
      return null
   }
}

const removeLoginAuth = () => {
   const cookies = getCookies()
   cookies.remove(TOKEN_KEY, { path: "/" })
   cookies.remove(USER_KEY, { path: "/" })
}

const storeRemoveToken = () => {
   removeLoginAuth()
}

export { storeLoginToken, getLoginToken, storeLoginUser, getLoginUser, removeLoginAuth, storeRemoveToken }


