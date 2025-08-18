import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"

export const Store = configureStore({
    reducer: {
        auth : authReducer,
    }
})