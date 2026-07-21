import { createSlice } from "@reduxjs/toolkit";

const sectionSlice = createSlice({
    name: "section",
    initialState: {
        section: [],
        sectionNames: [],
    },
    reducers: {
        setSection: (state, action) => {
            state.section = action.payload;
            state.sectionNames = action.payload.map((item) => item.sectionName);
        },
        setSectionNames: (state, action) => {
            state.sectionNames = action.payload;
        },
    },
});

export const { setSection, setSectionNames } = sectionSlice.actions;
export default sectionSlice.reducer; 