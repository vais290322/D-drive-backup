import { createSlice } from "@reduxjs/toolkit";


const inventorySlice = createSlice({
    name: "inventory",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
          
        },
        updateItemPrice: (state, action) => {
            const { itemId, newPrice } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.id === itemId);
            if (itemIndex !== -1) {
                state.items[itemIndex].price = newPrice;
            }
        },
    },
});

export const { setLoading, setError, addItem,updateItemPrice } = inventorySlice.actions;
export default inventorySlice.reducer;