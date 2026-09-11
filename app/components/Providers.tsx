"use client"

import { Provider } from "react-redux"
import { CookiesProvider } from "react-cookie"
import { store } from "../lib/store/store"
import AuthHydrator from "./auth/AuthHydrator"

export default function Providers({ children }: { children: React.ReactNode }) {
   return (
      <Provider store={store}>
         <CookiesProvider>
            <AuthHydrator />
            {children}
         </CookiesProvider>
      </Provider>
   )
}
