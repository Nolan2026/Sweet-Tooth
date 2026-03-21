import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Inv.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';
import { getImageUrl } from "../api/imageUtils.js";

export default function Inventory() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);


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

  /* =========================
     DELETE CATEGORY
  ========================= */
  const handleDeleteCategory = async (category) => {
    const isConfirmed = await confirm(
      "Delete Entire Category",
      `Are you sure you want to delete the "${category}" category and ALL items within it? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    try {
      await api.delete(`/admin/inventory/categories/${encodeURIComponent(category)}`);
      fetchItems();
      showToast(`Category "${category}" deleted successfully`, 'success');
    } catch (err) {
      console.error("Delete category error:", err);
      showToast(`Failed to delete category "${category}"`, 'error');
    }
  };

  return (
    <div className="inventory-container" style={{ scrollBehavior: 'smooth' }}>
      <h1>Inventory Management</h1>

      {/* Category Navigation */}
      <div className="category-nav">
        <span>Jump to:</span>
        {Object.keys(groupedItems).map((category) => (
          <div key={category} className="nav-chip-container">
            <a href={`#${category.replace(/\s+/g, '-')}`} className="nav-chip">
              {category}
            </a>
            <button
              className="chip-delete-icon"
              onClick={() => handleDeleteCategory(category)}
              title={`Delete ${category} category`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} id={category.replace(/\s+/g, '-')} className="category-table">
          <div className="category-header">
            <h2>{category}</h2>
            <button
              className="delete-category-btn"
              onClick={() => handleDeleteCategory(category)}
              title="Delete this entire category"
            >
              🗑️ Delete Category
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Price (₹)</th>
                  <th style={{ width: "300px" }}>Actions</th>
                  <th style={{ width: "250px" }}>Stock</th>
                </tr>
              </thead>

              <tbody className="invtable">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="invImg" data-label="Image">
                      <img
                        src={getImageUrl(item.image_url, API_BASE)}
                        alt={item.item_name}
                        loading="lazy"
                      />
                    </td>
                    <td className="tabData" data-label="Item Name">{item.item_name}</td>
                    <td className="tabData" data-label="Price">{item.price}</td>
                    <td className="tabData" data-label="Actions">
                      <div className="action-buttons">
                        <button className="edit-action" onClick={() => navigate(`/admin/edit/${item.id}`)}>
                          <span>✏️</span> Edit
                        </button>
                        <button className="delete-action" onClick={() => handleDelete(item.id)}>
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </td>
                    <td className="tabData" data-label="Stock">
                      <div className="stock-control">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={item.isavailable}
                            onChange={() => handleToggleAvailability(item.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className={item.isavailable ? 'stock-text available' : 'stock-text unavailable'}>
                          {item.isavailable ? 'In Stock' : 'Out Of Stock'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
