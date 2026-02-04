import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';

export default function Tab({ items, total, date, customerName, phoneNumber, paymentMethod, clear, setItemsList, setTotal }) {

  const his = useNavigate();
  const [billNumber, setBillNumber] = useState(null);
  const { showToast } = useToast();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const clr = async () => {
    await savedBill();
    clear();
  };

  const savedBill = async () => {
    if (items.length === 0) {
      showToast('No items to save', 'warning');
      return;
    }

    try {
      const res = await api.post('/admin/billing/create', {
        items: items,
        paymentMode: paymentMethod
      });

      setBillNumber(res.data.bill.id);
      showToast('Bill saved successfully!', 'success');
    } catch (err) {
      console.error('Save bill error:', err);
      showToast('Failed to save bill: ' + (err.response?.data?.message || err.message), 'error');
    }
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
        <p>Date: {date} | Time: {getCurrentTime()} <span className='billno'>Bill No: {billNumber || 'Unsaved'}</span></p>
        <p>Customer Details: {customerName || 'Walk-in'} | {phoneNumber || 'N/A'} | Payment: {paymentMethod}</p>
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
              <td>{item.itemName || item.name}</td>
              <td>{item.quantity} kg</td>
              <td>₹{item.subtotal || item.price}</td>
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

    </div>
  );
}