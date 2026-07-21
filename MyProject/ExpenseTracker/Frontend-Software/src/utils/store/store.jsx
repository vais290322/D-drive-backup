import {configureStore , combineReducers} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "../auth/authSlice";


const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
}

const rootReducer = combineReducers({
    auth: authSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export let persistor = persistStore(store)

export default store;