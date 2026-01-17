import { createSlice } from '@reduxjs/toolkit';

const old = [
  {
    billNo: 1,
    billdate: "06/06/2025",
    name: "Ravi Kumar",
    num: "9876543210",
    noItems: 3,
    total: 480,
    items: [
      { name: "Kaju Katli", grams: 250, price: 200 },
      { name: "Laddu", grams: 500, price: 180 },
      { name: "Jalebi", grams: 250, price: 100 }
    ]
  },
  {
    billNo: 2,
    billdate: "06/05/2025",
    name: "Sneha Reddy",
    num: "9123456780",
    noItems: 2,
    total: 300,
    items: [
      { name: "Milk Cake", grams: 500, price: 150 },
      { name: "Soan Papdi", grams: 500, price: 150 }
    ]
  }
]

const initialState = {
  bills: old,
  currentBillNo: 3,
}; 

export const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    saveBill: (state, action) => {
      state.bills.push({
        ...action.payload,
        billNo: state.currentBillNo,
      });
      state.currentBillNo += 1;
    },
    deleteBill: (state, action) => {
      state.bills = state.bills.filter(bill => bill.billNo !== action.payload);
    },
  },
});

export const { saveBill, deleteBill } = billSlice.actions;
export default billSlice.reducer;