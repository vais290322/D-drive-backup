import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category: [],
    categoryNames: [],

};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
            state.categoryNames = action?.payload?.map((category) => category?.name);
        },
    },
});

export const { setCategory } = categorySlice.actions;

export default categorySlice.reducer;
    