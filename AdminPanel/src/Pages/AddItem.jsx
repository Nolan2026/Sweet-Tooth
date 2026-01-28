import React, { useState } from 'react';
import '../styles/AddItem.css';
import axios from 'axios';

const CATEGORIES = [
    'Regular',
    'MilkSweets',
    'DryFruitSweets',
    'CoolSweets',
    'Snacks'
];

function AddItem() {
    const [formData, setFormData] = useState({
        category: '',
        item_name: '',
        price: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:5016/items', formData);

            if (response.status === 201) {
                setStatus({ type: 'success', message: 'Item added successfully!' });
                setFormData({
                    category: '',
                    item_name: '',
                    price: '',
                    image_url: ''
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'Failed to add item. Ensure backend is running.'
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
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="item_name">Item Name</label>
                        <input
                            type="text"
                            id="item_name"
                            name="item_name"
                            placeholder="e.g. Special Kaju Katli"
                            value={formData.item_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Price per kg/unit"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image_url">Image URL</label>
                        <input
                            type="url"
                            id="image_url"
                            name="image_url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image_url}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Item to Menu'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddItem;
