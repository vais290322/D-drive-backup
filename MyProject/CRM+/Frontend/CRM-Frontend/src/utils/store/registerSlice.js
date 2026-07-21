import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3002/api/v1/user', userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Return the API response data
    } catch (error) {
      // Reject with a detailed error message
      return rejectWithValue(error.response?.data?.message || 'Failed to register user');
    }
  }
);

// Define the initial state
const initialState = {
  loading: false,
  success: false,
  error: null,
  userData: null,
};

// Create the slice
const registerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload.data; // Store the registered user data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;

export default registerSlice.reducer;
