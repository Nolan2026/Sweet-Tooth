import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userToken');

  const formatPrice = (p) => `₹${p}`;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/log', { state: { from: '/cart' } });
      return;
    }
    navigate('/payment');
  };

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
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedWeight}`} className="cart-item">
                  <div className="cart-item-image">
                    {item.image_url ? (
                      <img src={`http://localhost:5016${item.image_url}`} alt={item.item_name} />
                    ) : (
                      <div className="placeholder">🍬</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.item_name}</h3>
                    <p className="item-variant">Unit: {item.selectedWeight < 1 ? `${item.selectedWeight * 1000}g` : '1kg'}</p>
                    <p className="item-price">{formatPrice(item.priceAtSelectedWeight)} each</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.selectedWeight, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedWeight, 1)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.selectedWeight)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-item-total">
                    {formatPrice(item.priceAtSelectedWeight * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <aside className="cart-summary-section">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>

          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
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