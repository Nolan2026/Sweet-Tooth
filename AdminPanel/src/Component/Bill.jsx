import '../styles/App.css';
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Tab from './Table';
import { useToast } from '../Context/ToastContext';

const PRESET_GRAMS = [50, 100, 200, 250, 500, 1000];
const Qty = [1, 2, 3, 4, 5, 10];

export default function Bill() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const Current = new Date();
  const [date, setDate] = useState(Current.toISOString().split('T')[0]);

  // Fetch all items from database
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/admin/inventory/items');
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Fetch items error:', err);
      showToast('Failed to fetch items', 'error');
    }
  };

  const clearBill = () => {
    setItemsList([]);
    setTotal(0);
    setCustomerName('');
    setPhoneNumber('');
    setSelectedItem('');
    setQuantity('');
  };

  const handleAddItem = () => {
    if (!selectedItem || !quantity) {
      showToast('Please select an item and enter quantity', 'warning');
      return;
    }

    const item = items.find(i => i.id === parseInt(selectedItem));
    if (!item) return;

    const price = item.price;
    const subtotal = price * quantity;

    const newItem = {
      itemId: item.id,
      itemName: item.item_name,
      quantity: quantity,
      price: price,
      subtotal: subtotal
    };

    const updatedList = [...itemsList, newItem];
    setItemsList(updatedList);
    setTotal(prev => prev + subtotal);

    setSelectedItem('');
    setQuantity('');
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bill-container">
      <h2 className='heading'>Billing Section</h2>
      <div className="input-section">
        <div className="date-section">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="customer-details">
          <input
            type="text"
            placeholder="Customer Name (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="customer-input"
          />
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="customer-input"
          />

          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="Cash"
                checked={paymentMethod === 'Cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                value="Card"
                checked={paymentMethod === 'Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
          </div>
        </div>

        <div className="item-selection-container">
          <label className="dropdown-label">Select Item</label>

          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="item-select"
          >
            <option value="">-- Select Item --</option>
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <optgroup key={category} label={category}>
                {categoryItems.map(item => (
                  <option key={item.id} value={item.id} disabled={!item.availability}>
                    {item.item_name} - ₹{item.price}/kg {!item.availability && '(Out of Stock)'}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="grams-section">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity (kg)"
              className="grams-input"
              step="0.1"
            />

            <div className="quick-grams">
              {PRESET_GRAMS.map((g) => (
                <button
                  key={g}
                  onClick={() => setQuantity(g / 1000)} // Convert grams to kg
                  className="gram-btn"
                >
                  {g}g
                </button>
              ))}
            </div>
          </div>

          <button
            className="add-item-btn"
            onClick={handleAddItem}
            disabled={!quantity || !selectedItem}
          >
            Add Item
          </button>
        </div>
      </div>

      <Tab
        items={itemsList}
        total={total}
        date={date}
        customerName={customerName}
        phoneNumber={phoneNumber}
        paymentMethod={paymentMethod}
        clear={clearBill}
        setItemsList={setItemsList}
        setTotal={setTotal}
      />
    </div>
  );
}