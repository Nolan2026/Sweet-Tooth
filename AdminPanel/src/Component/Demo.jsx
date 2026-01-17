

import React, { useState, useEffect } from 'react';

const pricePerGram = {
  Gold: 5000,
  Silver: 70,
  Platinum: 3000,
};

export default function Dropdown() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Populate dropdown items from pricePerGram object keys
    setItems(Object.keys(pricePerGram));
  }, []);

  return (
    <select defaultValue="">
      <option value="" disabled>
        Select item
      </option>
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}