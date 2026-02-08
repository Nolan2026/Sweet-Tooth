import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Orders.css";
import { useToast } from '../Context/ToastContext';

export default function Orders() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: "",
        startDate: "",
        endDate: ""
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            if (filter.status) params.append("status", filter.status);
            if (filter.startDate) params.append("startDate", filter.startDate);
            if (filter.endDate) params.append("endDate", filter.endDate);

            const res = await api.get(`/admin/orders?${params.toString()}`);
            setOrders(res.data);

        } catch (err) {
            console.error("Fetch orders error:", err);
            showToast("Failed to fetch orders", 'error');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
     fetchOrders();
    }, []);


    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh the list
            showToast("Order status updated successfully", 'success');
        } catch (err) {
            console.error("Status update error:", err);
            showToast("Failed to update order status", 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    console.log("Rendering orders:", orders);

    return (
        <div className="orders-container">         

            {/* Filters */}
            <div className="filters-sections">
                <div>
                    Total Orders {orders.length}

                </div>
                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>From:</label>
                    <input
                        type="date"
                        value={filter.startDate}
                        onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                    />
                </div>

                <div className="filter-group">
                    <label>To:</label>
                    <input
                        type="date"
                        value={filter.endDate}
                        onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                    />
                </div>

                <button onClick={fetchOrders} className="apply-filter-btn">
                    Apply Filters
                </button>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="loading">Loading orders...</div>
            ) : (
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p className="no-orders">No orders found</p>
                    ) : (
                        orders.map((order) => (

                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">Order #{order.id} {orders[orders.id]}
                                        <label htmlFor="selectOrder">
                                            <input
                                                type="checkbox"
                                                id="selectOrder"
                                                onChange={(e) => {
                                                    const { checked } = e.target;

                                                    if (checked) {
                                                        // Add ID to array
                                                        setSelectedOrder((prev) => [...prev, order.id]);
                                                    } else {
                                                        // Remove ID from array
                                                        setSelectedOrder((prev) =>
                                                            prev.filter((id) => id !== order.id)
                                                        );
                                                    }
                                                }}

                                            />
                                            Select
                                        </label>
                                    </div>
                                    <div className={`order-status status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </div>
                                </div>
                                         
                                <div className="order-details">
                                    <div className="detail-row">
                                        <strong>Customer:</strong> {order.user.username}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Email:</strong> {order.user.email}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Phone:</strong> {order.user.phone || 'N/A'}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Date:</strong> {formatDate(order.createdAt)}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Total:</strong> ₹{order.total}
                                    </div>
                                </div>

                                <div className="order-items">
                                    <strong>Items:</strong>
                                    <ul>
                                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.name} - {item.quantity}x @ ₹{item.pricePerUnit} = ₹{item.subtotal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="addres">
                                    <strong>Street <span>{order.user.addresses[0]?.street}</span></strong>
                                    <strong>City <span>{order.user.addresses[0]?.city}</span></strong>
                                    <strong>State <span>{order.user.addresses[0]?.state}</span></strong>
                                    <strong>Zipcode <span>{order.user.addresses[0]?.zipCode}</span></strong>
                                </div>

                                <div className="order-actions">
                                    <label>Update Status:</label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={order.status === "Cancelled"}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
