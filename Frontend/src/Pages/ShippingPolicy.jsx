import React from 'react';
import '../styles/Policy.css';

const ShippingPolicy = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Shipping Policy</h1>
                </header>
                <div className="policy-content">
                    <p>At Sweet Tooth, we strive to deliver your sweet treats in the freshest and fastest way possible. We understand how important it is for our products to arrive at your doorstep in perfect condition.</p>

                    <h2>1. Delivery Areas</h2>
                    <p>We currently deliver to select cities across India. To check if we deliver to your area, please enter your pin code on the checkout page. We're continuously working to expand our delivery reach.</p>

                    <h2>2. Dispatch Time</h2>
                    <p>Most orders are dispatched within 24–48 hours of order confirmation. During peak holiday seasons or promotional events, dispatch may take slightly longer. We'll always notify you via email or SMS once your order has been shipped.</p>

                    <h2>3. Delivery Timeframes</h2>
                    <p>Usually, we deliver within 2-5 business days from the date of dispatch. However, exact delivery times depend on your location and the efficiency of local courier services. Local deliveries in Kurnool are typically completed within 24 hours.</p>

                    <h2>4. Shipping Charges</h2>
                    <p>Shipping charges are calculated based on the weight of the order and the delivery distance. Free shipping is available for orders above ₹500. Standard shipping rates start at ₹50 for local and state-wide deliveries.</p>

                    <h2>5. Product Handling</h2>
                    <p>Our sweets are packed using specialized food-grade containers and bubble wrap to minimize any breakage or damage during transit. For temperature-sensitive items, we use insulated packaging (where applicable).</p>

                    <h2>6. Late or Missing Deliveries</h2>
                    <p>If your package is delayed or hasn't arrived within the expected timeframe, please reach out to our customer support team at support@sweettooth.com with your Order ID for assistance.</p>
                </div>
                <span className="last-updated">Last Updated: February 28, 2026</span>
            </div>
        </div>
    );
};

export default ShippingPolicy;
