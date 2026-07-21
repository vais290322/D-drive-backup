import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userDetails: [],
    schoolId: "",
    token: localStorage.getItem('token') || null,
    // isAuthenticated: !!localStorage.getItem('token') ,
    islogin : false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
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
        
        setToken: (state, action) => {
            state.token = action.payload;
            // state.isAuthenticated = !!action.payload;
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        },

        setIsLogin: (state, action) => {
            state.islogin = action.payload;
        },
        
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.islogin = false;
            state.userDetails = [];
            state.schoolId = "";
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
});

export const { setUser, logout, setUserDetails, setSchoolId, setToken,setIsLogin } = authSlice.actions;
export default authSlice.reducer;