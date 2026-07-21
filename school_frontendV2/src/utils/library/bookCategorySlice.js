import { createSlice } from "@reduxjs/toolkit";

const bookCategorySlice = createSlice({
    name: "bookCategory",
    initialState: {
        bookCategory: [],
        bookCategoryNames: [],
    },
    reducers: {
        setBookCategory: (state, action) => {
            state.bookCategory = action.payload;
            state.bookCategoryNames = action.payload.map((item) => item.bookCategory);
        },    
        setBookCategoryNames: (state, action) => {
            state.bookCategoryNames = action.payload;
        },    
    },
});

export const { setBookCategory, setBookCategoryNames } = bookCategorySlice.actions;
export default bookCategorySlice.reducer;

