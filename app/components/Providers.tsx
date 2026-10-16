"use client"

import { Provider } from "react-redux"
import { CookiesProvider } from "react-cookie"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { store } from "../lib/store/store"
import AuthHydrator from "./auth/AuthHydrator"
import CartIntentReplay from "./cart/CartIntentReplay"
import { ThemeProvider } from "./ThemeProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
          <CookiesProvider>
            <ThemeProvider>
              <AuthHydrator />
              <CartIntentReplay />
              {children}
              <ToastContainer
                 position="bottom-right"
                 autoClose={2000}
                 hideProgressBar={false}
                 newestOnTop
                 closeOnClick
                 pauseOnHover
                 draggable
              />
            </ThemeProvider>
          </CookiesProvider>
      </Provider>
    )
}
