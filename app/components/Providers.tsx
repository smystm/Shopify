"use client";

import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { store } from "../lib/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CookiesProvider>{children}</CookiesProvider>
    </Provider>
  );
}
