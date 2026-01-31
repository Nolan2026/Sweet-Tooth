import React, { useState } from "react";
import "../styles/AddItem.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
    "Regular",
    "MilkSweets",
    "DryFruitSweets",
    "CoolSweets",
    "Snacks",
];

function AddItem() {
    const [formData, setFormData] = useState({
        category: "",
        item_name: "",
        price: "",
    });

    const [image, setImage] = useState(null);
    const [isOther, setIsOther] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category" && value === "Others") {
            setIsOther(true);
            setFormData((prev) => ({ ...prev, category: "" }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const data = new FormData();
            data.append("category", formData.category);
            data.append("item_name", formData.item_name);
            data.append("price", formData.price);
            data.append("image", image); // 🔥 MUST match multer field

            const response = await axios.post(
                "http://localhost:5016/items",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                setStatus({ type: "success", message: "Item added successfully!" });
                setFormData({ category: "", item_name: "", price: "" });
                setImage(null);
                setIsOther(false);
            }
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error.response?.data?.error ||
                    "Failed to add item. Ensure backend is running.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-item-container">
            <div className="add-item-card">
                <h2>Add New Sweet Item</h2>

                {status.message && (
                    <div className={`message ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={isOther ? "Others" : formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                            <option value="Others">Other items</option>
                        </select>
                    </div>

                    {isOther && (
                        <div className="form-group">
                            <label htmlFor="other_category">Other Category</label>
                            <input
                                type="text"
                                id="other_category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Enter category"
                                required
                            />
                        </div>
                    )}

                    {/* Item Name */}
                    <div className="form-group">
                        <label htmlFor="item_name">Item Name</label>
                        <input
                            type="text"
                            id="item_name"
                            name="item_name"
                            value={formData.item_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label>Upload Image</label>

                        <div className="file-upload">
                            <label
                                className={`file-upload-label ${image ? "file-selected" : ""}`}
                            >
                                {image ? image.name : "Click to upload image"}
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    </div>


                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Item to Menu"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddItem;
