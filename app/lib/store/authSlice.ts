import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  name?: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  mode: "login" | "signup";
}

const initialState: AuthState = {
  user: null,
  mode: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<AuthState["mode"]>) {
      state.mode = action.payload;
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setMode, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
