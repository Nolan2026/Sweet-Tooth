import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Labels.css";
import api from "../api/axios";

function Label() {
  const [items, setItems] = useState([]);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="label-page">
      <div className="label-grid">
        {items.map((item) => (
          <div key={item.id} className="label-card">
            <h2 className="label-name">{item.item_name}</h2>
            <p className="label-price">₹{item.price} / kg</p>
          </div>
        ))}
      </div>

      <div className="print-btn-container">
        <button onClick={handlePrint} className="print-btn">
          Print Labels
        </button>
      </div>
    </div>
  );
}

export default Label;
