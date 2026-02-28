import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import api from "../api/axios";
import { useToast } from '../Context/ToastContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, updateItemWeight, getCartTotal } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userToken');
  const [couponCode, setCouponCode] = React.useState('');
  const [discountData, setDiscountData] = React.useState(null);
  const [couponError, setCouponError] = React.useState('');
  const [availableCoupons, setAvailableCoupons] = React.useState([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    fetchCoupons();
  }, []);

  // Monitor cart total and remove coupon if criteria no longer met
  React.useEffect(() => {
    if (discountData && availableCoupons.length > 0) {
      const activeCoupon = availableCoupons.find(c => c.code === discountData.code);
      if (activeCoupon && getCartTotal() < activeCoupon.minOrderValue) {
        setDiscountData(null);
        setCouponCode('');
        showToast(`Coupon removed: Minimum order of ₹${activeCoupon.minOrderValue} required`, 'warning');
      }
    }
  }, [cartItems, availableCoupons]);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setAvailableCoupons(res.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };


  const formatPrice = (p) => `₹${Math.round(p)}`;

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).toUpperCase();
    if (!code) return;

    setCouponError('');

    // Quick local check for criteria
    const coupon = availableCoupons.find(c => c.code === code);
    if (coupon) {
      if (getCartTotal() < coupon.minOrderValue) {
        showToast(`This coupon requires a minimum order of ₹${coupon.minOrderValue}`, 'error');
        return;
      }
    }

    try {
      const res = await api.post('/coupons/validate', {
        code: code,
        cartTotal: getCartTotal()
      });
      setDiscountData(res.data);
      setCouponCode(code);
      showToast('Coupon applied successfully!', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid coupon';
      setCouponError(errorMsg);
      showToast(errorMsg, 'error');
      setDiscountData(null);
    }
  };


  const calculateFinalTotal = () => {
    const total = getCartTotal();
    if (!discountData) return total;
    return Math.max(0, total - discountData.discountAmount);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/log', { state: { from: '/cart' } });
      return;
    }
    // Pass coupon data to payment page if needed
    navigate('/payment', { state: { coupon: discountData } });
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
                    <p className="item-variant">Unit: {item.selectedWeight < 1 ? `${item.selectedWeight * 1000}g` : '1 qty'}</p>
                    <p className="item-price">{formatPrice(item.priceAtSelectedWeight)} each</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => {
                        if (item.iskilo) {
                          updateItemWeight(item.id, item.selectedWeight, -1);
                        } else {
                          updateQuantity(item.id, item.selectedWeight, -1);
                        }
                      }}>-</button>
                      <span>{item.iskilo ? `${item.selectedWeight < 1 ? item.selectedWeight * 1000 : item.selectedWeight}${item.selectedWeight < 1 ? 'g' : 'kg'}` : item.quantity}</span>
                      <button onClick={() => {
                        if (item.iskilo) {
                          updateItemWeight(item.id, item.selectedWeight, 1);
                        } else {
                          updateQuantity(item.id, item.selectedWeight, 1);
                        }
                      }}>+</button>
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

          {availableCoupons.length > 0 && cartItems.length > 0 && (
            <div className="available-coupons">
              <h3>Available Offers</h3>
              <div className="coupons-grid">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`coupon-card ${discountData?.code === coupon.code ? 'applied' : ''}`}
                    onClick={() => handleApplyCoupon(coupon.code)}
                  >
                    <div className="coupon-card-header">
                      <span className="coupon-code">{coupon.code}</span>
                      <span className="coupon-discount">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <p>{coupon.discountType === 'percentage' ? `Get ${coupon.discountValue}% off on your order.` : `Flat ₹${coupon.discountValue} off on your sweet treats.`}</p>
                    <p className="min-order">Min Order: ₹{coupon.minOrderValue}</p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>Valid till: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <aside className="cart-summary-section">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-items-list">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedWeight}`} className="summary-item-row">
                <span>{item.item_name} (x{item.quantity})</span>
                <span>{formatPrice(item.priceAtSelectedWeight * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="summary-row">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
          </div>

          <div className="coupon-section">
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button
                onClick={handleApplyCoupon}
                className="coupon-btn"
              >
                Apply
              </button>
            </div>
            {couponError && <p style={{ color: 'red', fontSize: '0.75rem', margin: '0.2rem 0' }}>{couponError}</p>}
            {discountData && (
              <p style={{ color: 'green', fontSize: '0.75rem', margin: '0.2rem 0' }}>
                Coupon applied! You saved {formatPrice(discountData.discountAmount)}
              </p>
            )}
          </div>

          {discountData && (
            <div className="summary-row" style={{ color: '#666', marginBottom: '1rem' }}>
              <span>Coupon ({discountData.code})</span>
              <span style={{ color: 'green' }}>-{formatPrice(discountData.discountAmount)}</span>
            </div>
          )}

          <div style={{ borderTop: '2px solid #f0f0f0', margin: '1rem 0' }}></div>

          <div className="summary-row total" style={{ marginTop: '0' }}>
            <span>Final Price</span>
            <span>{formatPrice(calculateFinalTotal())}</span>
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