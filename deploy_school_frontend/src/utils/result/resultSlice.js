import { createSlice } from "@reduxjs/toolkit";

const resultSlice = createSlice({
    name: "result",
    initialState: {
       gradeSystem: [],
    },
    reducers: {
        setGradeSystem: (state, action) => {
            state.gradeSystem = action.payload;
        },
    },
}); 
export const { setGradeSystem } = resultSlice.actions;
export default resultSlice.reducer;