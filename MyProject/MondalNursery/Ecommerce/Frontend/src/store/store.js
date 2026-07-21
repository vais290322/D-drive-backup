import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import categorySlice from './categorySlice'
import shippingCostSlice from './shippingCostSlice'

export const store = configureStore({
  reducer: {
    user : userReducer,
    category: categorySlice,
    shippingCost: shippingCostSlice
  },
})