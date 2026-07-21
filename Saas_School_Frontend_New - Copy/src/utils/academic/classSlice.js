import { createSlice } from "@reduxjs/toolkit";

const classSlice = createSlice({
    name: "class",
    initialState: {
        class: [],
        classNames:[],
        classCount:0,
    },
    reducers: {
        setClass: (state, action) => {
            state.class = action.payload;
            state.classNames=action.payload.map((item) => item.className);
            state.classCount=action.payload.length
        },
        setClassNames: (state, action) => {
            state.classNames = action.payload;
        },
    },
});

export const { setClass , setClassNames} = classSlice.actions;
export default classSlice.reducer; 