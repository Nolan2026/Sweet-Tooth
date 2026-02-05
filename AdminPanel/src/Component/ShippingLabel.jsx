import React from "react";
import Barcode from "react-barcode";
import "../styles/shippingLabel.css";

const ShippingLabel = ({ order }) => {
    const address = order.user.addresses[0];

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
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Payment:</strong> {order.paymentType}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            </div>

            <div className="barcode">
                <Barcode value={order.trackingId} height={60} />
            </div>
        </div>
    );
};

export default ShippingLabel;
