// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userKey = "loggedUser";

const initialState = {
  user: JSON.parse(localStorage.getItem(userKey)) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(userKey, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem(userKey);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
