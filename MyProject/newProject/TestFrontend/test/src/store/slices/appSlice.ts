import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isSidebarOpen: boolean;
  someData: string | null;
  loading: boolean;
}

const initialState: AppState = {
  isSidebarOpen: false,
  someData: null,
  loading: false,
};

// Example Thunk
export const fetchSomeData = createAsyncThunk(
  'app/fetchSomeData',
  async (userId: string) => {
    // Simulate an API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Fetched data for user: ${userId}`);
      }, 1000);
    });
  }
);

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSomeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSomeData.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.someData = action.payload;
      })
      .addCase(fetchSomeData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { toggleSidebar, setSidebarOpen } = appSlice.actions;

export default appSlice.reducer;
