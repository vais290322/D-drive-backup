import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import categoryReducer from './features/categorySlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer
  }
})
