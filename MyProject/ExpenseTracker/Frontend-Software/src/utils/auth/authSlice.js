import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.auth = false;
      state.user = null;
      state.token = null;
    },
  },    
})

export const { setAuth, setUserDetails, setToken, logout } = authSlice.actions;
export default authSlice.reducer;