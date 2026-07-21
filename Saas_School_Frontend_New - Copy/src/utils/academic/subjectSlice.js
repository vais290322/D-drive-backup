import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
    name: "subject",
    initialState: {
        subject: [],
        subjectNames: [],
    },
    reducers: {
        setSubject: (state, action) => {
            state.subject = action.payload
            state.subjectNames = action.payload.map((item) => item.subjectName);
        },
        setSubjectNames: (state, action) => {
            state.subjectNames = action.payload
        },

    }
    
})
export const {setSubject, setSubjectNames} = subjectSlice.actions
export default subjectSlice.reducer;

 