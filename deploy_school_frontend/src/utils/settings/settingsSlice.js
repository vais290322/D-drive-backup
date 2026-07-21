import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        bloodGroups: [],
        bloodGroupNames: [],
        religions: [],
        religionNames: [],
        genders: [],
        genderNames: [],
    },
    reducers: {
        setBloodGroups: (state, action) => {
            state.bloodGroups = action.payload;
            state.bloodGroupNames = action.payload.map((item) => item.bloodGroup);
        },
        setReligions: (state, action) => {
            state.religions = action.payload;
            state.religionNames = action.payload.map((item) => item.religionName);
        },
        setGenders: (state, action) => {
            state.genders = action.payload;
            state.genderNames = action.payload.map((item) => item.genderName);
        },
    },
});

export const { setBloodGroups, setReligions, setGenders } = settingsSlice.actions;

export default settingsSlice.reducer;