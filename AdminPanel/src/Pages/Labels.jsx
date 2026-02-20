import React, { useEffect, useState } from "react";
import "../styles/Labels.css";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Label() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();

  const handlePrint = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one label to print.");
      return;
    }
    window.print();
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/admin/inventory/items");
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    fetchItems();
  }, []);

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  return (
    <div className="label-page">
      <span onClick={() => { navigate("/admin/profile") }} className="arrow">⬅ <h6>Back to Profile</h6></span>
      <div className="label-controls no-print">
        <button onClick={selectAll} className="control-btn">
          {selectedIds.size === items.length ? "Deselect All" : "Select All"}
        </button>
        <span>{selectedIds.size} labels selected </span>
      </div>

      <div className="label-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`label-card ${selectedIds.has(item.id) ? 'selected' : 'not-selected'}`}
            onClick={() => toggleSelect(item.id)}
          >
            <div className="selection-indicator no-print">
              {selectedIds.has(item.id) ? "✓" : ""}
            </div>
            <h2 className="label-name">{item.item_name}</h2>
            <p className="label-price">₹{item.price} / {item.iskilo ? "kg" : "pcs"}</p>
          </div>
        ))}
      </div>

      <div className="print-btn-container no-print">
        <button onClick={handlePrint} className="print-btn">
          Print Selected Labels
        </button>
      </div>
    </div>
  );
}

export default Label;
