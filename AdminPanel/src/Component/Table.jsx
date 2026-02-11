import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';

export default function Tab({ items, total, date, customerName, phoneNumber, paymentMethod, clear, setItemsList, setTotal }) {
  const his = useNavigate();
  const [profile, setProfile] = useState(null);

  const [billNumber, setBillNumber] = useState(() => {
    const stored = localStorage.getItem("billNumber");
    return stored ? Number(stored) : 1;
  });

  useEffect(() => {
    localStorage.setItem("billNumber", billNumber);
  }, [billNumber]);

  useEffect(() => {
    api.get("/admin/admin-profile").then(res => setProfile(res.data));
  }, []);

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

      setBillNumber(prev => prev + 1);
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
    his('/admin/history');
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
        <h1>{profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h1>
        <p style={{ whiteSpace: 'pre-wrap' }}>{profile?.address || "123 Main Street, Kurnool, Andhra Pradesh - 518001"}</p>
        {profile?.gstin && <p>GSTIN: {profile.gstin}</p>}
        <p>Phone: {profile?.phone || "+91 98765 43210"}</p>
      </div>


      <div className="bill-details">
        <p>Date: {date} | Time: {getCurrentTime()} <span className='billno'>Bill No: {billNumber || 'Unsaved'}</span></p>
        <p>Customer Details: {customerName || 'Walk-in'} | {phoneNumber || 'N/A'} | Payment: {paymentMethod}</p>
      </div>

      <table className="billTable">
        <thead>
          <tr className='headline'>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName || item.name}</td>
              <td>{item.quantity} {item.quantity > 50 ? 'gm' : 'pcs'}</td>
              <td>₹{item.price}</td>
              <td>₹{item.subtotal || item.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className='total'>
            <td colSpan="3"><strong>Total Amount</strong></td>
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