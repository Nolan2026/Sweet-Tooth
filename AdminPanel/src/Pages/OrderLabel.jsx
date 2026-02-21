import React, { useEffect, useState } from "react";
import ShippingLabel from "../Component/ShippingLabel";
import api from "../api/axios";
import "../styles/OrderLabel.css";
import { useToast } from "../Context/ToastContext";

const OrderLabel = () => {
    const [orders, setOrders] = useState([]);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState(new Set());
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
            // Clear selection on new fetch
            setSelectedOrders(new Set());
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

    const toggleSelect = (orderId) => {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrders(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedOrders.size === orders.length) {
            setSelectedOrders(new Set());
        } else {
            setSelectedOrders(new Set(orders.map(o => o.id)));
        }
    };

    const handlePrintAll = () => {
        window.print();
    };

    const handlePrintSelected = () => {
        if (selectedOrders.size === 0) {
            return showToast("Please select at least one label to print", "error");
        }

        // Add a temporary class to body to indicate printing selected
        document.body.classList.add('print-selected-only');
        window.print();
        document.body.classList.remove('print-selected-only');
    };

    return (
        <div className="order-label-page">
            <div className="filters-section no-print">
                <div className="filter-group">
                    <label>Selection:</label>
                    <button
                        className="select-all-btn"
                        onClick={toggleSelectAll}
                        style={{ background: selectedOrders.size === orders.length ? '#4CAF50' : '#f0f0f0', color: selectedOrders.size === orders.length ? 'white' : 'black' }}
                    >
                        {selectedOrders.size === orders.length ? "Deselect All" : "Select All"}
                    </button>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        {selectedOrders.size} of {orders.length} selected
                    </span>
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
                <div className="btns">
                    <button onClick={fetchOrders} className="apply-filter-btn">
                        Apply Filters
                    </button>
                    <button
                        className="print-selected-btn"
                        onClick={handlePrintSelected}
                        disabled={selectedOrders.size === 0}
                    >
                        Print Selected ({selectedOrders.size})
                    </button>
                    <button className="print-all-btn" onClick={handlePrintAll}>Print All</button>
                </div>
            </div>

            <div className="labels-container">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className={`label-wrapper ${selectedOrders.has(order.id) ? 'selected' : ''} ${!selectedOrders.has(order.id) ? 'hide-on-selected-print' : ''}`}
                    >
                        <div className="label-selector no-print">
                            <input
                                type="checkbox"
                                checked={selectedOrders.has(order.id)}
                                onChange={() => toggleSelect(order.id)}
                                id={`select-${order.id}`}
                            />
                            <label htmlFor={`select-${order.id}`}>Select for printing</label>
                        </div>
                        <ShippingLabel order={order} />
                    </div>
                ))}
            </div>

            {orders.length === 0 && !loading && (
                <div className="empty-state">No orders found for the selected criteria.</div>
            )}
        </div>
    );
};

export default OrderLabel;
