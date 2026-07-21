import { createSlice } from "@reduxjs/toolkit";

const teacherInformationSlice = createSlice({
    name: "teacherInfo",
    initialState: {
        teacherInfo: [],
        teachersNames: [], 
        teacherCount: 0,
        edpInfo: [],
        edpNames: [],
        edpCount: 0,
        accountantInfo: [],
        accountantNames: [],
        accountantCount: 0,
        librarianInfo: [],
        librarianNames: [],
        librarianCount: 0
    },
    
    reducers: {
        setTeacherInfo: (state, action) => {
            state.teacherInfo = action.payload;
            state.teachersNames = action.payload.map((item) => item.teachersName);
            state.teacherCount = action.payload.length
        },
        setEdpInfo: (state, action) => {
            state.edpInfo = action.payload;
            state.edpNames = action.payload.map((item) => item.edpName);
            state.edpCount = action.payload.length
        },
        setAccountantInfo: (state, action) => {
            state.accountantInfo = action.payload;
            state.accountantNames = action.payload.map((item) => item.accName);
            state.accountantCount = action.payload.length
        },
        setLibrarianInfo: (state, action) => {
            state.librarianInfo = action.payload;
            state.librarianNames = action.payload.map((item) => item.librarianName);
            state.librarianCount = action.payload.length
        },
    },
});

export const { setTeacherInfo, setEdpInfo, setLibrarianInfo , setAccountantInfo} = teacherInformationSlice.actions;
export default teacherInformationSlice.reducer;