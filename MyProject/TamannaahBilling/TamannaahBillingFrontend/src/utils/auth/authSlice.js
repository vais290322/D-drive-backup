import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userDetails:[],
        token:null
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
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setUser, logout ,setUserDetails,setToken} = authSlice.actions;
export default authSlice.reducer;