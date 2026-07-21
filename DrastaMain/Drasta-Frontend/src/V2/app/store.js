import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authReducer from './features/auth/authSlice';
import blogsReducer from './features/blogs/blogsSlice';
import galleryReducer from "./features/gallery/gallerySlice";
import { injectStore } from '../service/storeInjector';

// Config for auth persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'], // Only persist these keys from authSlice (optional)
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    blogs: blogsReducer,
    gallery: galleryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist requires this to be false
    }),
});

injectStore.setStore(store);

export const persistor = persistStore(store);
export default store;
