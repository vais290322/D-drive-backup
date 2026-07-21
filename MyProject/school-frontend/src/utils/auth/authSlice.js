import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userDetails:[],
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logout ,setUserDetails} = authSlice.actions;
export default authSlice.reducer;