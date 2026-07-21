import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tutionFeeMode: "monthly",
};

const tutionFeeModeSlice = createSlice({
  name: "tutionFeeMode",
  initialState,
  reducers: {
    setTutionFeeMode: (state, action) => {
      state.tutionFeeMode = action.payload;
    },
  },
});

export const { setTutionFeeMode } = tutionFeeModeSlice.actions;
export default tutionFeeModeSlice.reducer;
