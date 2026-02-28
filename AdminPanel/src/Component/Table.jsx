import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';

export default function Tab({ items, total, date, customerName, phoneNumber, paymentMethod, clear, setItemsList, setTotal }) {
  const his = useNavigate();
  const confirm = useConfirm();
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
      const newTotal = total - removedItem.subtotal;

      // Update the state directly
      setItemsList(updatedItems);
      setTotal(newTotal);
    }
  };

  const handleClearAll = async () => {
    const isConfirmed = await confirm("Clear Bill", "Are you sure you want to remove all items from the current bill? This cannot be undone.");
    if (isConfirmed) {
      clear();
      showToast('Bill cleared!', 'success');
    }
  };


  return (
    <div id="billSection">
      <div className="bill-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <div className="business-info" style={{ flex: 1 }}>
          <h1 style={{ margin: 0, textAlign: 'left' }}>{profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h1>
          <p style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>{profile?.address || "123 Main Street, Kurnool, Andhra Pradesh - 518001"}</p>
          {profile?.gstin && <p style={{ margin: '2px 0' }}>GSTIN: {profile.gstin}</p>}
          <p style={{ margin: '2px 0' }}>Phone: {profile?.phone || "+91 98765 43210"}</p>
        </div>

        {paymentMethod === 'UPI' && profile?.upi_id && (
          <div className="upi-qr-header" style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '8px', borderRadius: '8px', border: '2px solid #9c9797ff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <QRCode
                value={`upi://pay?pa=${encodeURIComponent(profile.upi_id)}&pn=${encodeURIComponent(profile.business_name || 'Sweet Tooth')}&am=${total}&tn=${encodeURIComponent(profile.upi_message || 'Payment for Sweet Tooth')}&cu=INR`}
                size={120}
              />
            </div>
            <p style={{ fontSize: '10px', fontSize: '12px', marginTop: '5px', fontWeight: 'bold', color: '#ff69b4', textTransform: 'uppercase' }}>Scan & Pay ₹{total}</p>
          </div>
        )}
      </div>


      <div className="bill-details">
        <p>Date: {date} | Time: {getCurrentTime()} <span className='billno'>Bill No: {billNumber || 'Unsaved'}</span></p>
        <p>Customer Details: {customerName || 'Walk-in'} | {phoneNumber || 'N/A'} | Payment: {paymentMethod}</p>
      </div>

      <div className="table-responsive">
        <table className="billTable">
          <thead>
            <tr className='headline'>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Rate (₹)</th>
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
      </div>

      <div className="bill-footer">
        <p>Thank you for shopping with us!</p>
        <p>Visit us again!</p>
      </div>

      <div className='btns'>
        <button onClick={handlePrint} className="print-btn">
          <span>🖨️</span> Print Bill
        </button>

        <button className='undo' disabled={items.length === 0} onClick={handleUndo}>
          <span>↩️</span> Undo Item
        </button>

        <button className='clear-all-btn' disabled={items.length === 0} onClick={handleClearAll} style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white', padding: '15px 0',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }}>
          <span>🗑️</span> Clear All
        </button>


        <button onClick={clr}
          disabled={items.length === 0} className='newbill'>
          <span>✨</span> New Bill
        </button>

        <button className='history' onClick={Move}>
          <span>⏳</span> History
        </button>
      </div>

    </div>
  );
}