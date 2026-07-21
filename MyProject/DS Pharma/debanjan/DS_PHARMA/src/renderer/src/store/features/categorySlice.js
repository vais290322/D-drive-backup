import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  loading: false,
  error: null
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload)
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      )
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setCategories, addCategory, updateCategory, deleteCategory, setLoading, setError } =
  categorySlice.actions
export default categorySlice.reducer
