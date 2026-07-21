import { createSlice } from "@reduxjs/toolkit";

const examTypeSlice = createSlice({
    name: "examType",
    initialState: {
        examType: [],
    },
    reducers: {
        setExamType: (state, action) => {
            state.examType = action.payload;
        },
    },
});

export const { setExamType } = examTypeSlice.actions;
export default examTypeSlice.reducer;
