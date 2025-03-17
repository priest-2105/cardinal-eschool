import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    name: string;
    role: string;
    user_codec: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
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
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;