import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: {
        searchClass:[],
        attendance: [],
    },
    reducers: {
        setAttendance: (state, action) => {
            state.attendance = action.payload;
        },
        setSearchClass: (state, action) => {
            state.searchClass = action.payload;
        },
    },
});

export const { setAttendance, setSearchClass } = attendanceSlice.actions;
export default attendanceSlice.reducer;
    