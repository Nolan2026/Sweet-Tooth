import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import QRCode from "react-qr-code";
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

    const qrData = `Order ID: ${order.id}\nTo: ${order.user.username}\nPhone: ${order.user.phone}\nAddress: ${address.city}, ${address.state}\nTotal: ₹${order.total}`;

    return (
        <div className="label-container">
            <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                <div className="fragile-img" style={{ flex: '0 0 70px', height: '70px', display: 'flex', alignItems: 'center' }}>
                    <img src={`${API_URL}/uploads/Fragile.png`} alt="Fragile" style={{ width: '100%', height: 'auto', maxHeight: '100%', mixBlendMode: 'multiply' }} />
                </div>

                <h2 className="company-name" style={{ margin: '0 10px', fontSize: '1.2rem', textAlign: 'center', flex: '1' }}>
                    {profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}
                </h2>

                <div className="qr-code" style={{ flex: '0 0 70px', height: '70px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <QRCode
                        value={qrData}
                        size={70}
                        style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>

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
                        width={1.2}
                        height={60}
                        fontSize={12}
                        margin={9}
                    />
                ) : (
                    <p style={{ color: 'red', fontSize: '0.8rem' }}>No Tracking ID available</p>
                )}
            </div>
        </div>
    );
};

export default ShippingLabel;
