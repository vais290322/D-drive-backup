import { createSlice } from "@reduxjs/toolkit";

const instituteSlice = createSlice({
    name: "institute",
    initialState: {
        institute: [],
    },
    reducers: {
        setInstitute: (state, action) => {
            state.institute = action.payload;
        },
    },
});

export const { setInstitute } = instituteSlice.actions;
export default instituteSlice.reducer; 