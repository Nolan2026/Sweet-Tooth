import React, { useEffect, useState } from "react";
import ShippingLabel from "../Component/ShippingLabel";
import api from "../api/axios";
import "../styles/OrderLabel.css";

const OrderLabel = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await api.get("/admin/orders");
        setOrders(res.data);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="order-label-page">
            <div className="labels-container">
                {orders.map((order) => (
                    <ShippingLabel key={order.id} order={order} />
                ))}
            </div>
            <button onClick={(e) => handlePrint()}>Print All</button>
        </div>

    );
};

export default OrderLabel;
