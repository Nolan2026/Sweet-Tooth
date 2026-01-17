import { createSlice } from '@reduxjs/toolkit';
import { Regular, MilkSweets, DryFruitSweets, CoolSweets, Snacks } from '../../Store/Cost';

const initialState = {
  categories: {
    Regular,
    MilkSweets,
    DryFruitSweets,
    CoolSweets,
    Snacks,
  },
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    updatePrice: (state, action) => {
      const { category, item, price } = action.payload;
      state.categories[category][item] = price;
    },
    addItem: (state, action) => {
      const { category, item, price } = action.payload;
      state.categories[category][item] = price;
    },
    removeItem: (state, action) => {
      const { category, item } = action.payload;
      delete state.categories[category][item];
    },
  },
});

export const { updatePrice, addItem, removeItem } = inventorySlice.actions;
export default inventorySlice.reducer;