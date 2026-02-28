import React from 'react';
import '../styles/Policy.css';

const RefundPolicy = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Return and Refund Policy</h1>
                </header>
                <div className="policy-content">
                    <p>At Sweet Tooth, we take pride in the quality of our handcrafted sweets. Because our products are perishable food items, they require special consideration for returns and refunds.</p>

                    <h2>1. Perishable Items</h2>
                    <p>Since sweets and snacks are perishable food products, we do not accept returns on these items. All sales are final once delivered. This helps us ensure that our products remain safe and hygienic for all customers.</p>

                    <h2>2. Damaged or Incorrect Orders</h2>
                    <p>In the event that your order arrives damaged, or if you received incorrect items, please contact us within 24 hours of delivery. We will require photos of the damaged items or the incorrect order to process your request.</p>

                    <h2>3. Eligibility for Refund</h2>
                    <p>Refunds or replacements will be considered under the following circumstances:</p>
                    <ul>
                        <li>Items arrived significantly damaged (not including minor breakages of delicate items)</li>
                        <li>Incorrect items were sent instead of what was ordered</li>
                        <li>Missing items from your order</li>
                        <li>Orders that were not delivered within the guaranteed timeframe due to our error</li>
                    </ul>

                    <h2>4. Refund Process</h2>
                    <p>Once your refund request is approved, it will be processed and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>

                    <h2>5. Order Cancellation</h2>
                    <p>You can cancel your order within 2 hours of placing it, as long as it has not been dispatched. After dispatch, cancellations are not possible.</p>

                    <h2>6. Contact Us</h2>
                    <p>If you have any questions about our Return and Refund Policy, please contact us at returns@sweettooth.com.</p>
                </div>
                <span className="last-updated">Last Updated: February 28, 2026</span>
            </div>
        </div>
    );
};

export default RefundPolicy;
