import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Orders.css";
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';

export default function Orders() {
    const { showToast } = useToast();
    const confirm = useConfirm();
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
            const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
            showToast(res.data.message || "Order status updated successfully", 'success');

            // Re-fetch data reactive way
            fetchOrders();
        } catch (err) {
            console.error("Status update error:", err);
            showToast("Failed to update order status", 'error');
        }
    };

    const handleDelete = async (orderId) => {
        const isConfirmed = await confirm("Delete Order", "Are you sure you want to permanently remove this order record? This cannot be undone.");
        if (!isConfirmed) return;

        try {
            await api.delete(`/admin/orders/${orderId}`);
            showToast("Order deleted successfully", 'success');
            fetchOrders();
        } catch (err) {
            console.error("Delete order error:", err);
            showToast("Failed to delete order", 'error');
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

    return (
        <div className="orders-container">

            {/* Filters */}
            <div className="filters-sections">
                <div>
                    Total Orders {orders.length}

                </div>
                <div className="filter-layout">
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
                                    <div className="order-id">Order #{order.id}</div>
                                    <div className="header-actions">
                                        <div className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                        <button
                                            className="order-delete-btn-sm"
                                            onClick={() => handleDelete(order.id)}
                                            title="Delete Record"
                                        >
                                            Delete
                                        </button>
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
                                    <div className="detail-row">
                                        <strong>Track id:</strong> {order.trackingId || 'N/A'}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Pay Method:</strong> {order.paymentMethod || 'N/A'}
                                        {order.paymentDetails?.transactionId && ` (Txn: ${order.paymentDetails.transactionId})`}
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
                                    {(() => {
                                        const subtotal = order.items.reduce((acc, item) => acc + item.subtotal, 0);
                                        const discount = subtotal - order.total;
                                        if (discount > 0) {
                                            return (
                                                <div className="order-breakdown" style={{ fontSize: '0.85rem', color: '#666', borderTop: '1px dashed #eee', marginTop: '5px', paddingTop: '5px' }}>
                                                    <div>Subtotal: ₹{subtotal}</div>
                                                    <div style={{ color: '#e71d36' }}>Discount: -₹{discount}</div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>

                                <div className="address-compact">
                                    <div className="addr-field"><strong>STREET:</strong> {order.user.addresses?.[0]?.street}</div>
                                    <div className="addr-field"><strong>AREA:</strong> {order.user.addresses?.[0]?.area}</div>
                                    <div className="addr-field"><strong>DISTRICT:</strong> {order.user.addresses?.[0]?.district}</div>
                                    <div className="addr-field"><strong>STATE:</strong> {order.user.addresses?.[0]?.state}</div>
                                    <div className="addr-field"><strong>PINCODE:</strong> {order.user.addresses?.[0]?.pinCode}</div>
                                </div>

                                <div className="order-actions-row">
                                    <div className="status-update-box">
                                        <label>Status:</label>
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
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
