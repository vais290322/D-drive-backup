import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  token: string | null;
  role: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setUser, setToken, setRole, clearUser } = userSlice.actions;
export default userSlice.reducer;
