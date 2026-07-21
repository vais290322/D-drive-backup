import { createSlice } from "@reduxjs/toolkit";

const allBooksSlice = createSlice({
    name: "allBooks",
    initialState: {
        allBooks: [],
    },
    reducers: {
        setAllBooks: (state, action) => {
            state.allBooks = action.payload;
        },
    },
});

export const { setAllBooks } = allBooksSlice.actions;

export default allBooksSlice.reducer;
