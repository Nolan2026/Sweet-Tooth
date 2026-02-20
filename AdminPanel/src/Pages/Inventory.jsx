import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Inv.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';

export default function Inventory() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [isavailable, setIsAvailable] = useState(true);
  const [newItem, setNewItem] = useState({
    category: "",
    item_name: "",
    price: "",
    img_url: "",
  });


  // Use the same base as API for images
  const API_BASE = api.defaults.baseURL;


  /* =========================
     FETCH IMAGE
  ========================= */
  const fetchImg = async (id) => {
    try {
      const imgs = await api.get(`uploads/${id}`);
      return;
    } catch (error) {
      console.error("Fetch error:", error);
      showToast('Failed to fetch items', 'error');
    }
  }


  /* =========================
     FETCH ITEMS
  ========================= */
  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/inventory/items");
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
     DELETE ITEM
  ========================= */
  const handleDelete = async (id) => {
    const isConfirmed = await confirm("Delete Item", "Are you sure you want to remove this item from inventory?");
    if (!isConfirmed) return;

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
      await api.patch(`/admin/inventory/items/${id}/isavailable`);
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
              <col style={{ width: "30%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Images</th>
                <th>Item</th>
                <th>Price (₹)</th>
                <th>Actions</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody className="invtable">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="invImg"><img src={`${API_BASE}${item.image_url}`} alt={item.item_name} /></td>
                  <td className="tabData">{item.item_name}</td>
                  <td className="tabData">{item.price}</td>
                  <td className="tabData">
                    <button onClick={() => navigate(`/admin/edit/${item.id}`)} >Edit</button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                  <td className="tabData">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={item.isavailable}
                        onChange={() => handleToggleAvailability(item.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className={item.isavailable ? 'stock-text available' : 'stock-text unavailable'}>
                      {item.isavailable ? 'In Stock' : 'Out of Stock'}
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
