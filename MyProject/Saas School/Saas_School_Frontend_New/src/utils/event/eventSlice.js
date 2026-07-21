import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
  },
  reducers: {
    addEvent(state, action) {
      state.events= action.payload;
    },
  },
});

export const { addEvent } = eventSlice.actions;
export default eventSlice.reducer;