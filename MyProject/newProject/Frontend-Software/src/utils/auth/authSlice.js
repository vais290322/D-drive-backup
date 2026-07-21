import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      state.auth = false;
    },
  },    
})

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;