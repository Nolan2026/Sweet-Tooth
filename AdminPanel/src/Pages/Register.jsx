import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Store/authSlice';
import { useToast } from '../Context/ToastContext';
import '../styles/Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otpSent) {
            handleVerifyOtp();
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            showToast(res.data.message || "OTP sent to your email", "success");
            setOtpSent(true);
        } catch (err) {
            const msg = err.response?.data?.message || "Registration Failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', {
                email: formData.email,
                otp,
                type: 'register'
            });
            dispatch(loginSuccess(res.data.token));
            showToast("Registration and Verification Successful", "success");
            navigate('/admin');
        } catch (err) {
            const msg = err.response?.data?.message || "Verification Failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post("/auth/resend-otp", { email: formData.email });
            showToast("OTP resent successfully", "success");
        } catch (error) {
            showToast("Failed to resend OTP", "error");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>{otpSent ? "Verify Email" : "Admin Registration"}</h2>
                <form onSubmit={handleSubmit}>
                    {!otpSent ? (
                        <>
                            <div className="input-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="input-group">
                            <label>Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}
                                value={otp}
                                onChange={handleOtpChange}
                                required
                                autoFocus
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <button type="button" className="text-btn" onClick={handleResendOtp} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem' }}>
                                    Resend OTP
                                </button>
                                <button type="button" className="text-btn" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem' }}>
                                    Back to Info
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (otpSent && otp.length !== 6)}
                        style={{ marginTop: '20px' }}
                    >
                        {loading ? "Processing..." : (otpSent ? "Verify OTP" : "Register")}
                    </button>
                </form>

                {!otpSent && (
                    <p className="auth-switch">
                        Already have an account? <Link to="/admin/login">Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
