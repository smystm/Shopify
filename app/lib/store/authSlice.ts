import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import type { Permission } from "@/app/lib/permissions"


export interface AuthUser {
   id?: number
   name?: string
   email?: string
   phone?: string
   // Controls what this user can do in the admin UI and APIs.
   permission?: Permission | null
}

interface AuthState {
   user: AuthUser | null
   mode: "login" | "signup"
   phoneVerifyToken?: string
   hydrated: boolean
}

const initialState: AuthState = {
   user: null,
   mode: "login",
   phoneVerifyToken: undefined,
   hydrated: false,
}


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setMode(state, action: PayloadAction<AuthState["mode"]>) {
         state.mode = action.payload
      },
      loginSuccess(state, action: PayloadAction<AuthUser>) {
         state.user = action.payload
         state.hydrated = true
      },
      logout(state) {
         state.user = null
         state.hydrated = true
         
      },
      setHydrated(state, action: PayloadAction<boolean>) {
         state.hydrated = action.payload
      },
      updatePhoneVerifyToken(state, action: PayloadAction<string | undefined>) {
         state.phoneVerifyToken = action.payload
      },
   },
})

export const { setMode, loginSuccess, logout, updatePhoneVerifyToken, setHydrated } = authSlice.actions
export const selectPhoneVerifyToken = (state: RootState) => state.auth.phoneVerifyToken
// Current signed-in user stored in Redux after login or hydration.
export const selectAuthUser = (state: RootState) => state.auth.user
// Permission of the current user, used to hide or show admin actions.
export const selectPermission = (state: RootState) => state.auth.user?.permission
// True after AdminHeader/user cookie data has been restored on page load.
export const selectHydrated = (state: RootState) => state.auth.hydrated
export default authSlice.reducer
