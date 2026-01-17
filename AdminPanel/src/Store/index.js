import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import cartReducer from './slices/cartSlice';
import billReducer from './slices/billSlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    cart: cartReducer,
    bill: billReducer,
  },
});