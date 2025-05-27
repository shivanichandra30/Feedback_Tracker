// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadUser, saveUser, clearUser } from "../../services/localStorage";

const initialState = {
  user: loadUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      clearUser();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
