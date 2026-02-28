import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/History.css';
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";

function BillHistory() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItems, setViewItems] = useState(null);
  const [profile, setProfile] = useState(null);
  const [billToPrint, setBillToPrint] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    paymentMode: ''
  });

  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.paymentMode) params.append('paymentMode', filter.paymentMode);

      const res = await api.get(`/admin/billing/history?${params.toString()}`);
      setBills(res.data);
    } catch (err) {
      console.error('Fetch bills error:', err);
      showToast('Failed to fetch billing history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (billId) => {
    const isConfirmed = await confirm("Delete Bill", "Are you sure you want to delete this bill record?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/admin/billing/${billId}`);
      showToast('Bill deleted successfully', 'success');
      fetchBills();
    } catch (err) {
      console.error('Delete bill error:', err);
      showToast('Failed to delete bill', 'error');
    }
  };

  useEffect(() => {
    fetchBills();
    api.get("/admin/admin-profile").then(res => setProfile(res.data));
  }, []);

  const handleView = (bill) => {
    setViewItems(bill);
  };

  const handlePrint = (bill) => {
    setBillToPrint(bill);
    setTimeout(() => {
      window.print();
      setBillToPrint(null);
    }, 300);
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-container">
      <h2 className="billHead">Billing History of {profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h2>

      {/* Filters */}
      <span onClick={() => { navigate("/admin/bill") }} className="arrow" style={{ marginLeft: "90px" }}>⬅ <h6>Back to Billing</h6></span>
      <div className="filters-section">
        <div className="filter-group">
          <label>Payment Mode:</label>
          <select
            value={filter.paymentMode}
            onChange={(e) => setFilter({ ...filter, paymentMode: e.target.value })}
          >
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />
        </div>

        <button onClick={fetchBills} className="apply-filter-btn">
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading bills...</div>
      ) : (
        <>
          <div className="bill-table">
            <table>
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Bill Date</th>
                  <th>Payment Mode</th>
                  <th>No of Items</th>
                  <th>Total</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No bills found</td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td className="today">{formatDate(bill.createdAt)}</td>
                      <td>{bill.paymentMode}</td>
                      <td>{Array.isArray(bill.items) ? bill.items.length : 0}</td>
                      <td>₹{bill.totalAmount}</td>
                      <td className="btns">
                        <button onClick={() => handleView(bill)} className="view-btn">View</button>
                        <button onClick={() => handlePrint(bill)} className="print-btn" style={{ background: '#4ade80', color: 'white', padding: '0.6rem 0.8rem' }}>Print</button>
                        <button onClick={() => handleDelete(bill.id)} className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {viewItems && (
            <div className="bill-view">
              <h3>
                Bill No: {viewItems.id}
                <b className='exit' onClick={() => setViewItems(null)}>×</b>
              </h3>
              <p><span>Date:</span> {formatDate(viewItems.createdAt)}</p>
              <p><span>Payment Mode:</span> {viewItems.paymentMode}</p>
              <p>
                <span>Total Items:</span> {Array.isArray(viewItems.items) ? viewItems.items.length : 0} |
                <span> Total:</span> ₹{viewItems.totalAmount}
              </p>
              <table className="view-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(viewItems.items) && viewItems.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Hidden Print Section */}
      {billToPrint && (
        <div id="printableBill" className="print-only-bill">
          <div className="bill-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
            <div className="business-info" style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#ff69b4' }}>{profile?.business_name || "Sweet Tooth"}</h1>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>{profile?.address}</p>
              {profile?.gstin && <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>GSTIN:</strong> {profile.gstin}</p>}
              <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Phone:</strong> {profile?.phone}</p>
            </div>

            {billToPrint.paymentMode === 'UPI' && profile?.upi_id && (
              <div className="upi-qr" style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: 'white', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}>
                  <QRCode
                    value={`upi://pay?pa=${encodeURIComponent(profile.upi_id)}&pn=${encodeURIComponent(profile.business_name || 'Sweet Tooth')}&am=${billToPrint.totalAmount}&tn=${encodeURIComponent(profile.upi_message || 'Payment for Sweet Tooth')}&cu=INR`}
                    size={80}
                  />
                </div>
                <p style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>SCAN & PAY</p>
              </div>
            )}
          </div>

          <div className="bill-details" style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', fontSize: '13px' }}>
            <p style={{ margin: '3px 0' }}><strong>Bill No:</strong> {billToPrint.id}</p>
            <p style={{ margin: '3px 0' }}><strong>Date:</strong> {formatDate(billToPrint.createdAt)}</p>
            <p style={{ margin: '3px 0' }}><strong>Payment:</strong> {billToPrint.paymentMode}</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Qty</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billToPrint.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.itemName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>₹{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}><strong>Grand Total</strong></td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', fontSize: '18px', color: '#ff69b4' }}><strong>₹{billToPrint.totalAmount}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#888' }}>
            <p>Thank you for shopping with us!</p>
            <p>Visit us again!</p>
          </div>
        </div>
      )}
    </div>

  );
}

export default BillHistory;
