import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/History.css';
import { useToast } from '../Context/ToastContext';

function BillHistory() {
  const { showToast } = useToast();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItems, setViewItems] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    paymentMode: ''
  });

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

  useEffect(() => {
    fetchBills();
  }, []);

  const handleView = (bill) => {
    setViewItems(bill);
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
      <h2 className="billHead">Billing History of Sweet Tooth</h2>

      {/* Filters */}
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
                        <button onClick={() => handleView(bill)}>View</button>
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
    </div>
  );
}

export default BillHistory;
