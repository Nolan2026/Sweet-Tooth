import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';
import { useLocation } from 'react-router-dom';
import '../styles/Payment.css';

function Payment() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const location = useLocation();
    const couponData = location.state?.coupon || null;

    const [profile, setProfile] = useState(null);
    const [validatedItems, setValidatedItems] = useState([]);
    const [confirmedTotal, setConfirmedTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'UPI', 'CARD'
    const [paymentDetails, setPaymentDetails] = useState({
        upiId: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: ''
    });

    const SHIPPING_CHARGE = 50;
    const COD_LIMIT = 999;

    const subtotal = confirmedTotal;
    const shipping = subtotal < 500 ? SHIPPING_CHARGE : 0;
    const discount = couponData ? couponData.discountAmount : 0;
    const finalTotal = Math.max(0, subtotal + shipping - discount);

    useEffect(() => {
        initializeCheckout();
    }, []);

    // Disable COD if price > 999
    useEffect(() => {
        if (finalTotal > COD_LIMIT && paymentMethod === 'COD') {
            setPaymentMethod('UPI');
            showToast('COD is not available for orders above ₹999', 'error');
        }
    }, [finalTotal, paymentMethod]);

    const initializeCheckout = async () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/log');
            return;
        }

        try {
            // 1. Fetch Profile
            const profRes = await fetch('http://localhost:5016/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!profRes.ok) throw new Error('Failed to load profile');
            const profData = await profRes.json();
            setProfile(profData);

            // 2. Validate Cart with DB Prices
            const valRes = await fetch('http://localhost:5016/order/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems })
            });

            if (!valRes.ok) {
                const errData = await valRes.json();
                throw new Error(errData.message || 'Failed to validate cart');
            }

            const valData = await valRes.json();
            setValidatedItems(valData.items);
            setConfirmedTotal(valData.total);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!profile?.addresses || profile.addresses.length === 0) {
            setError('Please add a delivery address in your profile first.');
            return;
        }

        // Validate Payment Info
        if (paymentMethod === 'UPI') {
            if (!paymentDetails.upiId.includes('@')) {
                setError('Please enter a valid UPI ID (e.g., name@okaxis)');
                return;
            }
        } else if (paymentMethod === 'CARD') {
            if (paymentDetails.cardNumber.length < 16 || !paymentDetails.cardExpiry || paymentDetails.cardCvv.length < 3) {
                setError('Please enter valid Card details');
                return;
            }
        }

        setIsProcessing(true);
        setError('');

        // Simulation for online payment
        if (paymentMethod !== 'COD') {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate gateway latency
        }

        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5016/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems,
                    total: finalTotal,
                    couponCode: couponData?.code
                })
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                // Redirect to a success page or profile orders
                showToast('Order placed successfully!', 'success');
                navigate('/profile');
            } else {
                setError(data.message || 'Failed to place order.');
            }
        } catch (err) {
            setError('Failed to connect to server.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="loading-state">Loading your secure checkout...</div>;

    const address = profile?.addresses?.[0]; // Default to first address for now

    return (
        <div className="payment-page">
            <div className="payment-container glass">
                <header className="payment-header">
                    <h1>Finalize Your Order</h1>
                    <p>Secure checkout for your sweet treats</p>
                </header>

                <div className="payment-grid">
                    <section className="summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {validatedItems.map((item, index) => (
                                <div key={index} className="summary-item">
                                    <span>{item.item_name} (x{item.quantity})</span>
                                    <span>₹{item.subtotal}</span>
                                </div>
                            ))}
                            <div className="summary-divider"></div>
                            <div className="summary-item">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="summary-item">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span className="free">FREE</span> : `₹${shipping}`}</span>
                            </div>
                            {couponData && (
                                <div className="summary-item" style={{ color: '#10b981', fontWeight: '600' }}>
                                    <span>Discount ({couponData.code})</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                        </div>
                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span>₹{finalTotal}</span>
                        </div>
                    </section>

                    <section className="shipping-section">
                        <h3>Delivery Address</h3>
                        {address ? (
                            <div className="address-card">
                                <p><strong>{address.label}</strong></p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} - {address.zipCode}</p>
                                <p>{address.country}</p>
                                <Link to="/profile" className="edit-addr-btn">Change Address</Link>
                            </div>
                        ) : (
                            <div className="no-address">
                                <p>No address found. You need a delivery address to proceed.</p>
                                <Link to="/profile" className="btn btn-secondary">Add Address in Profile</Link>
                            </div>
                        )}
                    </section>

                    <section className="method-section">
                        <h3>Payment Method</h3>
                        <div className="methods-list">
                            <div
                                className={`method-card ${paymentMethod === 'COD' ? 'active' : ''} ${finalTotal > COD_LIMIT ? 'disabled' : ''}`}
                                onClick={() => finalTotal <= COD_LIMIT && setPaymentMethod('COD')}
                            >
                                <div className="method-icon">🚚</div>
                                <div className="method-info">
                                    <p><strong>Cash on Delivery</strong></p>
                                    <p className="method-sub">
                                        {finalTotal > COD_LIMIT
                                            ? "Not available for orders > ₹999"
                                            : "Pay when your sweets arrive"}
                                    </p>
                                </div>
                                {paymentMethod === 'COD' && finalTotal <= COD_LIMIT && <div className="method-check">✓</div>}
                            </div>

                            <div
                                className={`method-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('UPI')}
                            >
                                <div className="method-icon">📱</div>
                                <div className="method-info">
                                    <p><strong>UPI Payment</strong></p>
                                    <p>Google Pay, PhonePe, Paytm</p>
                                </div>
                                {paymentMethod === 'UPI' && <div className="method-check">✓</div>}
                            </div>

                            {paymentMethod === 'UPI' && (
                                <div className="payment-details-form animate-in">
                                    <label>UPI ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. username@okaxis"
                                        value={paymentDetails.upiId}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                                        className="payment-input"
                                    />
                                </div>
                            )}

                            <div
                                className={`method-card ${paymentMethod === 'CARD' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('CARD')}
                            >
                                <div className="method-icon">💳</div>
                                <div className="method-info">
                                    <p><strong>Credit / Debit Card</strong></p>
                                    <p>Visa, Mastercard, RuPay</p>
                                </div>
                                {paymentMethod === 'CARD' && <div className="method-check">✓</div>}
                            </div>

                            {paymentMethod === 'CARD' && (
                                <div className="payment-details-form animate-in">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength="16"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                        className="payment-input"
                                    />
                                    <div className="card-row">
                                        <div className="input-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={paymentDetails.cardExpiry}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })}
                                                className="payment-input"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>CVV</label>
                                            <input
                                                type="password"
                                                placeholder="***"
                                                maxLength="3"
                                                value={paymentDetails.cardCvv}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvv: e.target.value })}
                                                className="payment-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="payment-actions">
                    <button
                        className="place-order-btn"
                        disabled={!address || isProcessing || cartItems.length === 0}
                        onClick={handlePlaceOrder}
                    >
                        {isProcessing ? 'Processing...' : 'Confirm & Place Order'}
                    </button>
                    <button className="back-btn" onClick={() => navigate('/cart')}>Back to Cart</button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
