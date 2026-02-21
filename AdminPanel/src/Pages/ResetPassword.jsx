import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';
import '../styles/Login.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

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
            const res = await api.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            showToast(res.data.message, "success");
            navigate('/admin/login');
        } catch (err) {
            const msg = err.response?.data?.message || "Reset failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>6-Digit OTP</label>
                        <input
                            type="text"
                            name="otp"
                            maxLength="6"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Update Password"}
                    </button>
                </form>
                <p className="auth-switch">
                    Remembered password? <Link to="/admin/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
