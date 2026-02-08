import React from "react";
import Barcode from "react-barcode";
import "../styles/shippingLabel.css";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ShippingLabel = ({ order }) => {
    const address = order.user.addresses[0];
    const shipDate = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    console.log("Order in ShippingLabel:", order);

    return (
        <div className="label-container">
            <h2 className="company-name">Sweet Tooth Bakery</h2>

            <div className="section">
                <div>
                    <h4>FROM:</h4>
                    <p>Sweet Tooth Bakery</p>
                    <p>Bus Stand Road</p>
                    <p>Kurnool, AP 518502</p>
                    <p>India</p>
                    <p>+91 9876543210</p>
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
                <p><strong className="date">Shipment Date:</strong> {shipDate}</p>
                <p><strong className="total">Total:</strong> ₹{order.total}</p>
            </div>

            <div className="barcode">
                <Barcode value={order.trackingId} width={1.4} height={55} />
            </div>
            <div className="glass">
                <div className="fragile-img">
                    <img src={`${API_URL}/uploads/Fragile.png`} alt="Fragile" />
                </div>
                <div className="note">
                    <h4>Handle With Care</h4>
                    <h4>from Sweet Tooth</h4>
                    <h4>sweetthooth@gmail.com</h4>
                </div>   
            </div>
        </div>
    );
};

export default ShippingLabel;
