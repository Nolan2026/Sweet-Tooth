import '../styles/App.css';
import React, { useState } from 'react';
import {
  Regular,
  Snacks,
  DryFruitSweets,
  CoolSweets,
  MilkSweets,
} from '../Store/Cost';
import Tab from './Table';

const PRESET_GRAMS = [50, 100, 200, 250, 500, 1000];
const Qty = [1, 2, 3, 4, 5, 10];
const fixedPriceMap = { Rasmalai: 40 };

const getPrice = (item, grams, category) => {
  if (category === 'Snacks') return item.price*grams;
  if (category === 'CoolSweets' && item.name === 'Rasmalai') {
    return fixedPriceMap['Rasmalai'] * (grams / 100);
  }
  const pricePerKg = item.price;
  return Math.round((pricePerKg / 1000) * grams);
};

export default function Bill() {
  const [selectedItems, setSelectedItems] = useState({
    Regular: '',
    MilkSweets: '',
    DryFruitSweets: '',
    Snacks: '',
  });

  const [billNo, setBillNo] = useState(1);

  const clearBill = () => {
    setItemsList([]);
    setTotal(0);
    setBillNo((prev) => prev + 1);
  };

  const [grams, setGrams] = useState('');
  const Current = new Date();
  const [date, setDate] = useState(Current.toDateString());

  const [itemsList, setItemsList] = useState([]);

  const [total, setTotal] = useState(0);

  const [customerName, setCustomerName] = useState('Nolan');

  const [phoneNumber, setPhoneNumber] = useState(1234567899);

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const categories = {
    Regular,
    MilkSweets,
    DryFruitSweets,
    CoolSweets,
    Snacks,
  };

  const handleSelect = (category, item) => {
    setSelectedItems((prev) => ({ ...prev, [category]: item }));
  };

  const handleAddItem = () => {
    const selectedCategory = Object.keys(selectedItems).find(
      (cat) => selectedItems[cat]
    );

    const selectedItem = selectedItems[selectedCategory];
    if (!selectedCategory || !selectedItem || !grams) return;

    const itemPrice = categories[selectedCategory][selectedItem];
    const price = getPrice(
      { name: selectedItem, price: itemPrice },
      grams,
      selectedCategory
    );

    const newItem = {
      name: selectedItem,
      grams,
      price,
      category: selectedCategory,
    };

    const updatedList = [...itemsList, newItem];
    setItemsList(updatedList);
    setTotal((prev) => prev + price);

    setSelectedItems((prev) => ({ ...prev, [selectedCategory]: '' }));
    setGrams('');
  };

  return (
    <div className="bill-container">
      <h2 className='heading'>Billing Section</h2>
      <div className="input-section">
        {' '}
        <div className="date-section">
          {' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />{' '}
        </div>
        <div className="customer-details">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="customer-input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="customer-input"
          />
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Cash
            </label>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Card
            </label>
            <label>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Online
            </label>
          </div>
      
        </div>
        <div className="item-selection-container">
          <label className="dropdown-label">Select Item</label>
          <div className="dropdowns">
            <select
              value={selectedItems.Regular}
              onChange={(e) => handleSelect('Regular', e.target.value)}
              className="item-select"
            >
              <option value="">Regular</option>
              {Object.keys(Regular).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={selectedItems.MilkSweets}
              onChange={(e) => handleSelect('MilkSweets', e.target.value)}
              className="item-select"
            >
              <option value="">Milk Sweets</option>
              {Object.keys(MilkSweets).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={selectedItems.DryFruitSweets}
              onChange={(e) => handleSelect('DryFruitSweets', e.target.value)}
              className="item-select"
            >
              <option value="">Dry Fruit Sweets</option>
              {Object.keys(DryFruitSweets).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={selectedItems.Snacks}
              onChange={(e) => handleSelect('Snacks', e.target.value)}
              className="item-select"
            >
              <option value="">Snacks</option>
              {Object.keys(Snacks).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grams-section">
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              placeholder="Enter grams"
              className="grams-input"
            />
            
            <div className="quick-grams">
            {selectedItems.Snacks? 
            <div>
              {Qty.map((q)=>(
                <button
                  key={q} onClick={()=> setGrams(q)} className='gram-btn'>
                  {q} pcs
                </button>
              ))}
            </div> :
          <div>
              {PRESET_GRAMS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrams(g)}
                  className="gram-btn"
                >
                  {g}g
                </button>
              ))} </div> }
            </div>
          </div>

          <button
            className="add-item-btn"
            onClick={handleAddItem}
            disabled={!grams}
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