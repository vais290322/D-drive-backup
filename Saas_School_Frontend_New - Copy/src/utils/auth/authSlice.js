import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userDetails:[],
        schoolId:""
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },

        setSchoolId: (state, action) => {
            state.schoolId = action.payload;
        },

        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logout ,setUserDetails,setSchoolId} = authSlice.actions;
export default authSlice.reducer;