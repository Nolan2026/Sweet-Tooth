import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import profileAvatar from '../assets/profile_avatar.png';
import { useToast } from '../Context/ToastContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        label: 'Home',
        street: '',
        area: '',
        district: '',
        state: '',
        pinCode: '',
        country: 'India'
    });

    const countries = [
        "India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia", "Singapore", "Germany", "France", "Italy", "Japan", "South Korea", "China", "Brazil", "Russia", "South Africa", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "Malaysia", "Thailand", "Indonesia", "Vietnam", "Philippines", "New Zealand", "Netherlands", "Switzerland", "Spain", "Portugal", "Mexico", "Argentina", "Chile", "Colombia", "Peru", "Egypt", "Nigeria", "Kenya", "Ghana", "Turkey", "Israel", "Norway", "Sweden", "Denmark", "Finland", "Ireland", "Belgium", "Austria", "Greece"
    ]; // Truncated but sufficient for now or I can add more if needed. Let's add more common ones.


    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                window.location.href = '/log';
                return;
            }

            const res = await axios.get('http://localhost:5016/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('userToken');
                window.location.href = '/log';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const dataToSend = editingId ? { ...formData, id: editingId } : formData;

            await axios.post('http://localhost:5016/user/address', dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            showToast(editingId ? 'Address updated successfully!' : 'Address added successfully!', 'success');

            // Immediate refresh for better UX
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error saving address:', error);
            showToast('Failed to save address.', 'error');
        }
    };

    const handleEdit = (addr) => {
        setFormData({
            label: addr.label,
            street: addr.street,
            area: addr.area || '',
            district: addr.district || '',
            state: addr.state,
            pinCode: addr.pinCode || '',
            country: addr.country
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:5016/user/address/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchProfile();
            showToast('Address deleted.', 'success');
        } catch (error) {
            console.error('Error deleting address:', error);
            showToast('Failed to delete address.', 'error');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:5016/order/cancel/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showToast('Order cancelled successfully', 'success');
            fetchProfile(); // Refresh profile to show updated status
        } catch (error) {
            console.error('Error cancelling order:', error);
            const msg = error.response?.data?.message || 'Failed to cancel order';
            showToast(msg, 'error');
        }
    };

    if (loading) return (
        <div className="profile-container">
            <div className="profile-card" style={{ textAlign: 'center', padding: '100px' }}>
                <div className="loading-spinner"></div>
                <p>Loading your profile details...</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className="profile-container">
            <div className="profile-card" style={{ textAlign: 'center', padding: '60px' }}>
                <h2 style={{ color: '#e71d36', marginBottom: '20px' }}>Unable to load profile</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>We couldn't retrieve your data. Please check your connection or try logging in again.</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => fetchProfile()} className="add-addr-btn">Try Again</button>
                    <button onClick={() => window.location.href = '/log'} className="update-btn" style={{ width: 'auto' }}>Go to Login</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-card">
                <header className="profile-header">
                    <img src={profileAvatar} alt="Profile" className="profile-img" />
                    <div className="profile-info">
                        <h2>{user.username}</h2>
                        <p>{user.email} • {user.phone || 'No phone added'}</p>
                    </div>
                </header>

                <div className="profile-sections">
                    <section className="address-section">
                        <div className="section-header">
                            <h3 className="section-title">📍 Saved Addresses</h3>
                            <button
                                className="add-addr-btn"
                                onClick={() => {
                                    setShowForm(!showForm);
                                    setEditingId(null);
                                    setFormData({ label: 'Home', street: '', area: '', district: '', state: '', pinCode: '', country: 'India' });
                                }}
                            >
                                {showForm ? 'Cancel' : '+ Add New'}
                            </button>
                        </div>


                        {showForm && (
                            <form className="address-form" onSubmit={handleSubmit}>
                                <h4>{editingId ? 'Edit Address' : 'Add New Address'}</h4>
                                <div className="form-group">
                                    <label>Label (e.g. Home, Office)</label>
                                    <input
                                        type="text" name="label" value={formData.label}
                                        onChange={handleChange} className="profile-input" required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street</label>
                                    <input
                                        type="text" name="street" value={formData.street}
                                        onChange={handleChange} className="profile-input" required
                                    />
                                </div>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label>Area</label>
                                        <input
                                            type="text" name="area" value={formData.area}
                                            onChange={handleChange} className="profile-input" required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>District</label>
                                        <input
                                            type="text" name="district" value={formData.district}
                                            onChange={handleChange} className="profile-input" required
                                        />
                                    </div>
                                </div>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text" name="state" value={formData.state}
                                            onChange={handleChange} className="profile-input" required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pin Code</label>
                                        <input
                                            type="text" name="pinCode" value={formData.pinCode}
                                            onChange={handleChange} className="profile-input" required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <select
                                        name="country" value={formData.country}
                                        onChange={handleChange} className="profile-input" required
                                    >
                                        <option value="">Select Country</option>
                                        {countries.sort().map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="update-btn">
                                    {editingId ? 'Save Changes' : 'Add Address'}
                                </button>
                            </form>
                        )}

                        <div className="addresses-list">
                            {user.addresses.length > 0 ? (
                                user.addresses.map(addr => (
                                    <div key={addr.id} className="address-card">
                                        <div className="address-header">
                                            <span className="address-label">{addr.label}</span>
                                            <div className="address-actions">
                                                <button onClick={() => handleEdit(addr)} className="edit-addr-icon">Edit</button>
                                                <button onClick={() => handleDelete(addr.id)} className="delete-addr-icon">Delete</button>
                                            </div>
                                        </div>
                                        <div className="address-body">
                                            <p>{addr.street}, {addr.area}</p>
                                            <p>{addr.district}, {addr.state} - {addr.pinCode}</p>
                                            <p>{addr.country}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !showForm && <p className="no-data">No addresses saved yet.</p>
                            )}
                        </div>
                    </section>

                    <section className="orders-section">
                        <h3 className="section-title">🍰 Order History</h3>
                        <div className="order-list">
                            {user.orders.length > 0 ? (
                                user.orders.map(order => (
                                    <div key={order.id} className="order-item">
                                        <div className="order-details">
                                            <p><strong>Order #{order.id}</strong></p>
                                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p>Total: ₹{order.total}</p>
                                        </div>
                                        <div className="order-actions-status">
                                            <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="cancel-order-btn"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No orders yet. Discover our sweets!</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
