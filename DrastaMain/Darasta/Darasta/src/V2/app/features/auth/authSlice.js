import { createSlice } from "@reduxjs/toolkit";
import {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
} from "./authAsyncThunk";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        const res = action.payload;
        const accessToken = `Bearer  ${res.accessToken}`;
        const refreshToken = `Bearer ${res.refreshToken}`;
        state.status = "succeeded";
        state.user = { ...res.data, accessToken, refreshToken };
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // forget-password
      .addCase(forgetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // reset-password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
export const authAction = authSlice.actions;
