import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for handling login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Replace with your backend API endpoint
      const response = await axios.post('http://localhost:3002/api/v1/login',
       credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Enable cookies if needed
      });
      return response.data; // Return the response data (e.g., token, user info)
    } catch (error) {
      // Handle server or network errors
      return rejectWithValue(
        error.response?.data?.message || 'Failed to login. Please try again.'
      );
    }
  }
);

// Initial state for authentication slice
const initialState = {
  user: null, // Will store user information upon successful login
  token: null, // JWT token
  loading: false,
  error: null,
};

// Create the slice
const logSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optionally handle logout or token clearing
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming the backend returns user details
        state.token = action.payload.token; // Assuming the backend returns a JWT token
        localStorage.setItem('token', action.payload.token); // Save token for future use
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use the error message from `rejectWithValue`
      });
  },
});

export const { logout } = logSlice.actions; // Export logout action
export default logSlice.reducer; // Export reducer
