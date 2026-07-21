import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = true;
      state.email = action.payload;
    },
    logout: (state) => {
      state.auth = false;
      state.email = null;
    },
  },    
})

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;