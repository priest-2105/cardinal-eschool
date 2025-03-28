import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    name: string;
    role: string;
    user_codec: string;
    has_subscription: boolean; 
  } | null;
  subscription: {
    isActive: boolean;
    plan: string;
    expiresAt: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  subscription: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuthState(state) {
      state.token = null;
      state.user = null;
    },
    handleTokenExpiration(state) {
      // Clear state when token expires
      state.token = null;
      state.user = null;
    },
    setSubscriptionStatus(state, action: PayloadAction<{ plan: string; expiresAt: string }>) {
      state.subscription = {
        isActive: true,
        plan: action.payload.plan,
        expiresAt: action.payload.expiresAt,
      };
    },
    clearSubscriptionStatus(state) {
      state.subscription = null;
    },
  },
});

export const { 
  setAuthState, 
  clearAuthState, 
  handleTokenExpiration,
  setSubscriptionStatus,
  clearSubscriptionStatus 
} = authSlice.actions;
export default authSlice.reducer;