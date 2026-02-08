import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./orderSlice";

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
    },
});

