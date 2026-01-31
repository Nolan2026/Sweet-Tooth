import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Edits.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);

        setName(res.data.item_name);
        setPrice(res.data.price);
        setImage(res.data.image_url || "");
        setAvailability(res.data.availability ?? true);

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Item not found");
        navigate("/admin/inventory");
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/items/${id}`, {
        item_name: name,
        price: Number(price),
        image_url: image,
        availability,
      });

      console.log(res.data);

      navigate("/admin/inventory");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading item...</p>;

  return (
    <div className="edit-container">
      <h3>Edit Item</h3>

      <form className="edit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={availability === true}
              onChange={() => setAvailability(true)}
            />
            Available
          </label>

          <label>
            <input
              type="radio"
              checked={availability === false}
              onChange={() => setAvailability(false)}
            />
            Out of Stock
          </label>
        </div>

        <button type="submit">Update Item</button>
        <button onClick={() => navigate("/inventory")}>Cancel</button>
      </form>
    </div>
  );
}

export default Edit;
