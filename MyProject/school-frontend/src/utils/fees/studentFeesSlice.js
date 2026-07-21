import {createSlice} from '@reduxjs/toolkit';

const studentFeesSlice = createSlice({
    name: 'studentFees',
    initialState: {
        studentFees: [],
    },
    reducers: {
        setStudentFees: (state, action) => {
            state.studentFees = action.payload;
        },
    },
});

export const {setStudentFees} = studentFeesSlice.actions;
export default studentFeesSlice.reducer; 