import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Inv.css";
import { Navigate, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import { useToast } from '../Context/ToastContext';

export default function Inventory() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [newItem, setNewItem] = useState({
    category: "",
    item_name: "",
    price: "",
    img_url: "",
  });

  /* =========================
     FETCH ITEMS
  ========================= */
  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast('Failed to fetch items', 'error');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* =========================
     GROUP BY CATEGORY
  ========================= */
  const groupedItems = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  /* =========================
     ADD ITEM
  ========================= */
  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      await api.post("/items", {
        category: newItem.category,
        item_name: newItem.item_name,
        price: Number(newItem.price),
        image_url: newItem.category,
      });

      setNewItem({ category: "", item_name: "", price: "", img_url: "" });
      fetchItems();
      showToast('Item added successfully', 'success');
    } catch (err) {
      console.error("Add error:", err);
      showToast('Failed to add item', 'error');
    }
  };

  /* =========================
     Clear Felds
  ========================= */

  const clear = () => {
    setNewItem({
      category: "",
      item_name: "",
      price: "",
      img_url: ""
    })
  };

  /* =========================
     DELETE ITEM
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      fetchItems();
      showToast('Item deleted successfully', 'success');
    } catch (err) {
      console.error("Delete error:", err);
      showToast('Failed to delete item', 'error');
    }
  };

  /* =========================
     TOGGLE AVAILABILITY
  ========================= */
  const handleToggleAvailability = async (id) => {
    try {
      await api.patch(`/admin/inventory/items/${id}/availability`);
      fetchItems(); // Refresh the list
      showToast('Stock status updated', 'success');
    } catch (err) {
      console.error("Toggle availability error:", err);
      showToast("Failed to update availability", 'error');
    }
  };

  return (
    <div className="inventory-container">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="category-table">
          <h2>{category}</h2>

          <table>
            <colgroup>
              <col style={{ width: "30%" }} />  {/* Item */}
              <col style={{ width: "25%" }} />  {/* Price */}
              <col style={{ width: "25%" }} />  {/* Actions */}
              <col style={{ width: "25%" }} />  {/* Stock */}
            </colgroup>

            <thead>
              <tr>
                <th>Item</th>
                <th>Price (₹)</th>
                <th>Actions</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.price}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/edit/${item.id}`)} >Edit</button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={item.availability}
                        onChange={() => handleToggleAvailability(item.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className={item.availability ? 'stock-text available' : 'stock-text unavailable'}>
                      {item.availability ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
