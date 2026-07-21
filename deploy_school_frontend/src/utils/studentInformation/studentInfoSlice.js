import { createSlice } from "@reduxjs/toolkit";

const studentInfoSlice = createSlice({
    name: "studentInfo",
    initialState: {
        studentInfo: [],
    },
    reducers: {
        setStudentInfo(state, action) {
            state.studentInfo = action.payload;
        },
    },
});

export default studentInfoSlice.reducer;    
export const { setStudentInfo } = studentInfoSlice.actions;
