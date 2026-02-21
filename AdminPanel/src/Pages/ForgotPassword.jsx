import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';
import '../styles/Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            showToast(res.data.message, "success");
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>Forgot Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                    Enter your email to receive a 6-digit OTP to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                    <div className="forgot-password-link">
                        <Link to="/admin/reset-password">Already have OTP? Reset Now</Link>
                    </div>
                </form>
                <p className="auth-switch">
                    <Link to="/admin/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
