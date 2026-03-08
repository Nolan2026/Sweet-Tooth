import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Context/ToastContext';
import '../styles/Form.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
            showToast(res.data.message, "success");
            // Automatically push to reset page with email
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <header className="login-header">
                    <h2>Forgot Password</h2>
                    <p>Enter your email to receive a reset OTP</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="form-inputs">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-actions">
                        <button type="submit" className="primary-auth-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                        <div className="auth-toggle">
                            <Link to="/log" className="toggle-btn">Back to Login</Link>
                            <span style={{ margin: '0 10px' }}>|</span>
                            <Link to="/reset-password" style={{ color: 'var(--primary)', fontWeight: '600' }}>I have an OTP</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
