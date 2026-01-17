import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveBill } from '../Store/slices/billSlice.js';

export default function Tab({ items, total, date, customerName, phoneNumber, paymentMethod, clear, setItemsList, setTotal }) {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.bill);
  const his = useNavigate();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const currentBillNum = useSelector((state) => state.bill.currentBillNo);

  const clr = () => {
    savedBill();
    clear();
  };

  const savedBill = () => {
    const now = new Date().toLocaleDateString();

    dispatch(saveBill({
      billdate: now,
      name: customerName,
      num: phoneNumber,
      noItems: items.length,
      total: total,
      items: items,
    }));
  };

  const handlePrint = () => {
    window.print();
    //savedBill();
  };

  const Move = () => {
    his('/history');
  };

  const handleUndo = () => {
    if (items.length > 0) {
      const updatedItems = [...items];
      const removedItem = updatedItems.pop();
      const newTotal = total - removedItem.price;

      // Update the state directly
      setItemsList(updatedItems);
      setTotal(newTotal);
    }
  };

  return (
    <div id="billSection">
      <div className="bill-header">
        <h1>Sweet Tooth</h1>
        <p>123 Main Street, Kurnool, Andhra Pradesh - 518001</p>
        <p>GSTIN: 37AABCS1429B1Z1</p>
        <p>Phone: +91 98765 43210</p>
      </div>

      <div className="bill-details">
        <p>Date: {date} | Time: {getCurrentTime()} <span className='billno'>Bill No: {currentBillNum}</span></p>
        <p>Customer Details: {customerName} | {phoneNumber} | Payment: {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
      </div>

      <table className="billTable">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity (g)</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name.replace(/_/g, ' ')}</td>
              <td>{item.grams}</td>
              <td>₹{item.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2"><strong>Total Amount</strong></td>
            <td><strong>₹{total}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div className="bill-footer">
        <p>Thank you for shopping with us!</p>
        <p>Visit us again!</p>
      </div>

      <div className='btns'>
        <button onClick={handlePrint} className="print-btn">Print Bill</button>

        <button className='undo' disabled={items.length === 0} onClick={handleUndo}>Undo Item</button>

        <button onClick={clr}
          disabled={items.length === 0} className='newbill'>New Bill</button>

        <button className='history' onClick={Move}>History</button>
      </div>
      {saveBill}
    </div>
  );
}