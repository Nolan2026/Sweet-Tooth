import React, { useEffect, useState } from "react";
import ShippingLabel from "../Component/ShippingLabel";
import api from "../api/axios";
import "../styles/OrderLabel.css";
import { useToast } from "../Context/ToastContext";

const OrderLabel = () => {
    const [orders, setOrders] = useState([]);
    const { showToast } = useToast();
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

    console.log("Rendering orders:", orders);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="order-label-page">
            <div className="filters-section">
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
                <button className="btn" onClick={(e) => handlePrint()}>Print All</button>
            </div>

            <div className="labels-container">
                {orders.map((order) => (
                    <ShippingLabel key={order.id} order={order} />
                ))}
            </div>
        </div>

    );
};

export default OrderLabel;
