import { createSlice } from "@reduxjs/toolkit";

const subjectAssignSlice = createSlice({
    name: "subjectAssign",
    initialState: {
        subjectAssign: [],
    },
    reducers: {
        setSubjectAssign: (state, action) => {
            state.subjectAssign = action.payload
        }
    }
    
})
export const {setSubjectAssign} = subjectAssignSlice.actions
export default subjectAssignSlice.reducer;

 