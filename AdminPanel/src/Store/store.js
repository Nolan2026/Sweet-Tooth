import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./orderSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
        auth: authReducer,
    },
});


