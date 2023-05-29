import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    full_name: string;
    email: string;
    deposit: {
      id: string;
      amount: number;
    };
  } | null;
  isLoggedIn: boolean;
}
const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoggedIn: false,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    resetAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    setDeposit: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          deposit: { ...state.user.deposit, amount: action.payload },
        };
      }
    },
  },
});

export const { setAuth, resetAuth, setDeposit} = authSlice.actions;
export default authSlice;
