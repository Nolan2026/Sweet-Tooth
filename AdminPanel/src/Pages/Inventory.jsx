import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Inv.css";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
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
     UPDATE PRICE
  ========================= */
  const handleSave = async (id) => {
    try {
     const res = await api.put(`/items/${id}`, {
        price: Number(editedPrice),
      });
      console.log("BACKEND RESPONSE:", res.data);

      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Update error:", err);
    }
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
      {/* ADD ITEM */}
      <div className="add-item-form">
        <h2>Add New Item</h2>
        <form onSubmit={handleAddItem}>
          <input
            placeholder="Category"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            required
          />
          <input
            placeholder="Item Name"
            value={newItem.item_name}
            onChange={(e) =>
              setNewItem({ ...newItem, item_name: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: e.target.value })
            }
            required
          />
          <input
            placeholder="Img Url"
            value={newItem.img_url}
            onChange={(e) =>
              setNewItem({ ...newItem, img_url: e.target.value })
            }
            required
          />
          <button type="submit">Add Item</button>
          <button onClick={() => { clear }}>Clear</button>
        </form>
      </div>

      {/* INVENTORY TABLES */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="category-table">
          <h2>{category}</h2>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.valueAsNumber || "")}
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="action-buttons">
                    {editingId === item.id ? (
                      <button onClick={() => handleSave(item.id)} disabled={editedPrice === "" || isNaN(editedPrice)}>Save</button>
                      
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditedPrice(item.price);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id)}>
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
  );
}
