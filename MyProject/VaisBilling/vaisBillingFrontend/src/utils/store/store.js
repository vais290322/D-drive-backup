import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "../auth/authSlice";
import employeeSlice from "../employee/employeeSlice"
import recruitmentSlice from "../recruitment/recruitmentSlice"


const persistConfig = {
    key: "root", // Root key for the persisted state
    storage, // Use localStorage to persist state
    whitelist: ["auth"], // List the reducers you want to persist
  };

  const rootReducer = combineReducers({
   auth:authSlice,
   employee:employeeSlice,
   recruitment:recruitmentSlice
});

  
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Export persistor for integration with PersistGate
export const persistor = persistStore(store);

export default store;
