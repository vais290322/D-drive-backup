import { createSlice } from "@reduxjs/toolkit";

const classRoutineSlice = createSlice({
    name: "classRoutine",
    initialState: {
        classRoutine: [],
    },
    reducers: {
        setClassRoutine: (state, action) => {
            state.classRoutine = action.payload
        }
    }
});

export const { setClassRoutine } = classRoutineSlice.actions;
export default classRoutineSlice.reducer;