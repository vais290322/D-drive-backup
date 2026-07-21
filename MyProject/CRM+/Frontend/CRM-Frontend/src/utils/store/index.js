import { configureStore } from '@reduxjs/toolkit';
import logReducer from './logSlice'
import registerReducer from './registerSlice'
export const store = configureStore({
  reducer: {
    auth: logReducer ,
    register : registerReducer

  },
});
