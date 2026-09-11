import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface AuthUser {
  name?: string;
  email?: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  mode: "login" | "signup";
  phoneVerifyToken?: string;
  hydrated: boolean;
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
      state.mode = action.payload;
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    logout(state) {
      state.user = null;
      state.hydrated = true;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    updatePhoneVerifyToken(state, action: PayloadAction<string | undefined>) {
      state.phoneVerifyToken = action.payload;
    },
  },
});

export const { setMode, loginSuccess, logout, updatePhoneVerifyToken, setHydrated } = authSlice.actions;
export const selectPhoneVerifyToken = (state: RootState) => state.auth.phoneVerifyToken;
export default authSlice.reducer;
