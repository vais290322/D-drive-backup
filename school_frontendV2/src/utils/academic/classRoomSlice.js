import { createSlice } from "@reduxjs/toolkit";

const classRoomSlice = createSlice({
    name: "classRoom",
    initialState: {
        classRoom: [],
    },
    reducers: {
        setClassRoom: (state, action) => {
            state.classRoom = action.payload
        }
    }
    
})
export const {setClassRoom} = classRoomSlice.actions
export default classRoomSlice.reducer;

 