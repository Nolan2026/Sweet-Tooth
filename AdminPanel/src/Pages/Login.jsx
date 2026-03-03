import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { loginStart, loginSuccess, loginFailure } from '../Store/authSlice';
import { useToast } from '../Context/ToastContext';
import '../styles/Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
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

        dispatch(loginStart());
        try {
            const res = await api.post('/auth/login', { ...credentials, panel: 'ADMIN' });
            if (res.data.requiresOtp) {
                showToast(res.data.message || "OTP sent to your email", "success");
                setOtpSent(true);
                dispatch(loginFailure(null)); // Clear loading state but not with error
            } else {
                dispatch(loginSuccess(res.data.token));
                showToast("Login Successful", "success");
                navigate('/admin');
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Login Failed";
            dispatch(loginFailure(msg));
            showToast(msg, "error");
        }
    };

    const handleVerifyOtp = async () => {
        dispatch(loginStart());
        try {
            const res = await api.post('/auth/verify-otp', {
                email: credentials.email,
                otp,
                type: 'login',
                panel: 'ADMIN'
            });
            dispatch(loginSuccess(res.data.token));
            showToast("Login Successful", "success");
            navigate('/admin');
        } catch (err) {
            const msg = err.response?.data?.message || "Verification Failed";
            dispatch(loginFailure(msg));
            showToast(msg, "error");
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post("/auth/resend-otp", { email: credentials.email });
            showToast("OTP resent successfully", "success");
        } catch (error) {
            showToast("Failed to resend OTP", "error");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>{otpSent ? "Verify Account" : "Admin Login"}</h2>
                <form onSubmit={handleSubmit}>
                    {!otpSent ? (
                        <>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
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
                                    Change Email
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (otpSent && otp.length !== 6)}
                        style={{ marginTop: '20px' }}
                    >
                        {loading ? "Processing..." : (otpSent ? "Verify OTP" : "Login")}
                    </button>

                    {!otpSent && (
                        <div className="forgot-password-link">
                            <Link to="/admin/forgot-password">Forgot Password?</Link>
                        </div>
                    )}
                </form>

                {!otpSent && (
                    <p className="auth-switch">
                        Don't have an admin account? <Link to="/admin/register">Register</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
