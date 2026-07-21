import { createSlice } from "@reduxjs/toolkit";

const tutionFeesSlice = createSlice({
    name: "tutionFees",
    initialState: {
       tutionFees:[],
    },
    reducers:{
        setTutionFees: (state, action) => {
            state.tutionFees = action.payload;
        },
    }
});

export const { setTutionFees} = tutionFeesSlice.actions;
export default tutionFeesSlice.reducer;  