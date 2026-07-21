import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shippingCostValue: null,
};

export const shippingCostSlice = createSlice({
    name: "shippingCost",
    initialState,
    reducers: {
        setShippingCostValue: (state, action) => {
            state.shippingCostValue = action.payload;
        },
    },
});

export const { setShippingCostValue } = shippingCostSlice.actions;

export default shippingCostSlice.reducer;
    