import { createSlice } from "@reduxjs/toolkit";

const classTimeSlice = createSlice({
    name: "classTime",
    initialState: {
        classTime: [],
    },
    reducers: {
        setClassTime: (state, action) => {
            state.classTime = action.payload
        }
    }
    
})
export const {setClassTime} = classTimeSlice.actions
export default classTimeSlice.reducer;

 