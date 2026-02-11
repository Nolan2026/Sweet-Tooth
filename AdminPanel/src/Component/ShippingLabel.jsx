import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import "../styles/shippingLabel.css";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ShippingLabel = ({ order }) => {
    const [profile, setProfile] = useState(null);
    const address = order.user.addresses[0];
    const shipDate = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    useEffect(() => {
        axios.get(`${API_URL}/admin/admin-profile`).then(res => setProfile(res.data));
    }, []);

    return (
        <div className="label-container">
            <h2 className="company-name">{profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h2>

            <div className="section">
                <div>
                    <h4>FROM:</h4>
                    <p>{profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{profile?.address || "Bus Stand Road, Kurnool, AP"}</p>
                    <p>{profile?.phone || "+91 9876543210"}</p>
                </div>

                <div>
                    <h4>TO:</h4>
                    <p>{order.user.username}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state}</p>
                    <p>{address.zipCode}</p>
                    <p>{order.user.phone}</p>
                </div>
            </div>

            <div className="order-info">
                <p><strong className="id">Order ID:</strong> {order.id}</p>
                <p><strong className="date">Dispatch Date:</strong> {shipDate}</p>
                <p><strong className="total">Total:</strong> ₹{order.total}</p>
            </div>

            <div className="barcode">
                {order.trackingId ? (
                    <Barcode
                        value={order.trackingId}
                        format="CODE128"
                        width={1.6}
                        height={60}
                        fontSize={14}
                        margin={10}
                    />
                ) : (
                    <p style={{ color: 'red', fontSize: '0.8rem' }}>No Tracking ID available</p>
                )}
            </div>

            <div className="label-footer-grid">
                <div className="glass">
                    <div className="fragile-img">
                        <img src={`${API_URL}/uploads/Fragile.png`} alt="Fragile" />
                    </div>
                </div>

                <div className="note">
                    <h4>Handle With Care</h4>
                    <h4>from {profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h4>
                    <h4>{profile?.business_email || "sweettooth@gmail.com"}</h4>
                </div>
            </div>
        </div>
    );
};

export default ShippingLabel;

