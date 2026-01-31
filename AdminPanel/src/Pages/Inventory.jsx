import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Inv.css";
import { Navigate, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";

export default function Inventory() {
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
    } catch (err) {
      console.error("Add error:", err);
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
      console.log("Item has been deleted", new Date().toLocaleString());
    } catch (err) {
      console.error("Delete error:", err);
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
                    <span className={item.availability ? 'badge-yes' : 'badge-no'}>
                      {item.availability ? 'Yes' : 'No'}
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
