import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "@/V2/service";

export const signup = createAsyncThunk(
    "auth/signup",
    async (user, { rejectWithValue }) => {
        try {
            await api.post("/register", user);
        } catch (error) {
            const msg =
            error.response?.data?.message ||
            error.message ||
            "Signup failed";
            return rejectWithValue(msg);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (user, { rejectWithValue }) => {
        try {
            const {data} = await api.post("/login", user);
            return data;
        } catch (error) {
            const msg =
            error.response?.data?.message ||
            error.message ||
            "Login failed";
            return rejectWithValue(msg);
        }
    }
);

export const forgetPassword = createAsyncThunk("auth/forgetPassword",
    async (email, {rejectWithValue}) => {
        try {
            await api.post("/forgot-password", email);
        } catch (error) {
            const msg =
            error.response?.data?.message ||
            error.message ||
            "Forget password failed";
            return rejectWithValue(msg);
        }
    }
) 

export const resetPassword = createAsyncThunk("auth/resetPassword", 
    async ({data, token}, {rejectWithValue}) => {
        try {
            await api.post(`/reset-password?token=${token}`, data);
        } catch (error) {
            const msg =
            error.response?.data?.message ||
            error.message ||
            "Reset password failed";
            return rejectWithValue(msg);
        }
    }
)

export const logout = createAsyncThunk("auth/logout", 
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/logout");
            return res.data;
        } catch (error) {
           const msg =
            error.response?.data?.message ||
            error.message ||
            "Reset password failed";
            return rejectWithValue(msg);
        }
    }
)