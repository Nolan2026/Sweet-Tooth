import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Context/ToastContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Form.css';

const ResetPassword = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return showToast("Passwords do not match", "error");
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/reset-password`, {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            showToast(res.data.message, "success");
            navigate('/log');
        } catch (err) {
            const msg = err.response?.data?.message || "Reset failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <header className="login-header">
                    <h2>Reset Password</h2>
                    <p>Enter the OTP sent to your email</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="form-inputs">
                        <input
                            type="email"
                            name="email"
                            className="login-input"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="otp"
                            className="login-input"
                            placeholder="6-Digit OTP"
                            maxLength="6"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                className="login-input"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="login-input"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="login-actions">
                        <button type="submit" className="primary-auth-btn" disabled={loading}>
                            {loading ? "Resetting..." : "Update Password"}
                        </button>
                        <div className="auth-toggle">
                            <Link to="/log" className="toggle-btn">Wait, I remember it!</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
