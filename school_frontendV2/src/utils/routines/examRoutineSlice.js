import { createSlice } from "@reduxjs/toolkit";

const examRoutineSlice = createSlice({
    name: "examRoutine",
    initialState: {
        examRoutine: [],
    },
    reducers: {
        setExamRoutine: (state, action) => {
            state.examRoutine = action.payload;
        },
    },
});

export const { setExamRoutine } = examRoutineSlice.actions;
export default examRoutineSlice.reducer;
