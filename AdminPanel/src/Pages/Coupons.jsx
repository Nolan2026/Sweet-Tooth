import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Coupons.css';
import { useConfirm } from '../Context/ConfirmContext';
import { useToast } from '../Context/ToastContext';

const Coupons = () => {
    const confirm = useConfirm();
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        minOrderValue: '0',
        usageLimit: '1'
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await api.get('/admin/coupons');
            setCoupons(res.data);
        } catch (err) {
            console.error('Failed to fetch coupons', err);
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/admin/coupons/${id}/toggle`);
            fetchCoupons();
        } catch (err) {
            alert('Failed to update coupon');
        }
    };

    const handleDelete = async (id) => {
        const isConform = await confirm("Delete Coupan", "Are You Sure Delete Coupan");
        try {
            if(!isConform) return;
            await api.delete(`/admin/coupons/${id}`);
            fetchCoupons();
        } catch (err) {
            alert('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/coupons', formData);
            setShowForm(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                expiryDate: '',
                minOrderValue: '0',
                usageLimit: '1'
            });
            fetchCoupons();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coupons-container">
            <div className="coupons-header">
                <h1>Coupon Management</h1>
                {!showForm && (
                    <button className="add-btn" onClick={() => setShowForm(true)}>+ Create New Coupon</button>
                )}
            </div>

            {showForm && (
                <form className="coupon-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Coupon Code</label>
                        <input
                            type="text"
                            placeholder="e.g. SAVE20"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Discount Type</label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Discount Value</label>
                        <input
                            type="number"
                            required
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                            type="date"
                            required
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Min Order Value (₹)</label>
                        <input
                            type="number"
                            value={formData.minOrderValue}
                            onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Usage Limit (Per User/Total)</label>
                        <input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Coupon'}
                        </button>
                    </div>
                </form>
            )}

            <div className="coupons-grid">
                {coupons.map((coupon) => (
                    <div className="coupon-card" key={coupon.id}>
                        <div
                            className="coupon-code"
                            onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                showToast(`Coupon ${coupon.code} copied to clipboard!`)
                                // alert(`Coupon ${coupon.code} copied to clipboard!`);
                            }}
                            title="Click to copy"
                            style={{ cursor: 'pointer' }}
                        >
                            {coupon.code}
                        </div>
                        <div className="coupon-info">
                            <p><strong>Discount:</strong> {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'} OFF</p>
                            <p><strong>Min Order:</strong> ₹{coupon.minOrderValue}</p>
                            <p><strong>Expires:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                            <p><strong>Usage:</strong> {coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
                        </div>
                        <span className={`coupon-status ${coupon.active ? 'status-active' : 'status-inactive'}`}>
                            {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="card-actions">
                            <button className="toggle-btn" onClick={() => handleToggle(coupon.id)}>
                                {coupon.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(coupon.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;
