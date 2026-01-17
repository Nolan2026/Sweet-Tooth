import React, { useState } from 'react';
import '../styles/Inv.css';

export default function Inventory({ data, onUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [newItem, setNewItem] = useState({ category: '', name: '', price: '' });

  const handleDelete = (category, item) => {
    const updatedData = { ...data };
    delete updatedData[category][item];
    onUpdate(updatedData);
  };

  const handleEdit = (category, item, price) => {
    setEditingItem({ category, item });
    setEditedPrice(price);
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    const { category, item } = editingItem;
    const updatedData = { ...data };
    updatedData[category][item] = parseFloat(editedPrice);
    onUpdate(updatedData);
    setEditingItem(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.category || !newItem.name || !newItem.price) return;

    const updatedData = { ...data };
    if (!updatedData[newItem.category]) {
      updatedData[newItem.category] = {};
    }
    updatedData[newItem.category][newItem.name] = parseFloat(newItem.price);
    onUpdate(updatedData);
    setNewItem({ category: '', name: '', price: '' });
  };

  return (
    <div className="inventory-container">
      <div className="add-item-form">
        <h2>Add New Item</h2>
        <form onSubmit={handleAddItem}>
          <select 
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(data).map(category => (
              <option key={category} value={category}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
          <button type="submit">Add Item</button>
        </form>
      </div>

      <div className="inventory-tables">
        {Object.entries(data).map(([category, items]) => (
          <div key={category} className="category-table">
            <h2>{category.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(items).map(([item, price]) => (
                  <tr key={item}>
                    <td>{item.replace(/_/g, ' ')}</td>
                    <td>
                      {editingItem?.category === category && editingItem?.item === item ? (
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        `₹${price}`
                      )}
                    </td>
                    <td className="action-buttons">
                      {editingItem?.category === category && editingItem?.item === item ? (
                        <button onClick={handleSave} className="save-btn">Save</button>
                      ) : (
                        <button 
                          onClick={() => handleEdit(category, item, price)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(category, item)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}