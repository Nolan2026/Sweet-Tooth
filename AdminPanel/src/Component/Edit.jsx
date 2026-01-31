import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Edits.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);

  const [existingImage, setExistingImage] = useState(""); // 🔥 string
  const [newImage, setNewImage] = useState(null);          // 🔥 File

  const [loading, setLoading] = useState(true);

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);

        setName(res.data.item_name);
        setPrice(res.data.price);
        setAvailability(res.data.availability ?? true);
        setExistingImage(res.data.image_url || "");

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
      const formData = new FormData();
      formData.append("item_name", name);
      formData.append("price", Number(price));
      formData.append("availability", availability);

      // ✅ send image ONLY if user selected new one
      if (newImage) {
        formData.append("image", newImage);
      }

      const res = await api.put(`/items/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

        {/* 🔥 Existing image preview */}
        {existingImage && !newImage && (
          <img
            src={`http://localhost:5016${existingImage}`}
            alt="Current"
            className="edit-image-preview"
          />
        )}

        {/* 🔥 New image preview */}
        {newImage && (
          <img
            src={URL.createObjectURL(newImage)}
            alt="Preview"
            className="edit-image-preview"
          />
        )}

        <div className="form-group">
          <label>Change Image (optional)</label>

          <div className="file-upload">
            <label className="file-upload-label">
              {newImage ? newImage.name : "Click to upload new image"}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

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
        <button type="button" onClick={() => navigate("/admin/inventory")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Edit;
