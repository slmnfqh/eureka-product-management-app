import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id_user: number;
  nama_user: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  loginError: string | null;
  registerError: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
  loading: false,
  loginError: null,
  registerError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ===== LOGIN =====
    loginStart(state) {
      state.loading = true;
      state.loginError = null;
    },

    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.loading = false;
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    loginError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.loginError = action.payload;
    },

    // ===== REGISTER =====
    registerStart(state) {
      state.loading = true;
      state.registerError = null;
    },

    registerSuccess(state) {
      state.loading = false;
      state.registerError = null;
    },

    registerError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.registerError = action.payload;
    },

    restoreAuth(state, action: PayloadAction<{ token: string; user: User }>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.loginError = null;
      state.registerError = null;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.loginError = null;
      state.registerError = null;
    },

    resetAuthState(state) {
      state.loginError = null;
      state.registerError = null;
      state.loading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  registerStart,
  registerSuccess,
  registerError,
  restoreAuth,
  logout,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
