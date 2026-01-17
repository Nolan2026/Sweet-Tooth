import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

function Cart() {
  // Placeholder cart state
  const cartItems = [];

  return (
    <div className="cart-page">
      <Link to="/" className="continue-shopping">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Sweets
      </Link>

      <h1>Your Shopping Cart</h1>

      <div className="cart-container">
        <main className="cart-items-section">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">🛒</span>
              <h2>Your cart is as empty as a box of finished laddus!</h2>
              <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="cart-list">
              {/* Cart items would go here */}
            </div>
          )}
        </main>

        <aside className="cart-summary-section">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-row">
            <span>Taxes</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹0.00</span>
          </div>

          <button className="checkout-btn" disabled={cartItems.length === 0}>
            Proceed to Checkout
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
            Secure SSL Checkout
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;