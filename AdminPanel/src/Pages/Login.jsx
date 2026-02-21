import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { loginStart, loginSuccess, loginFailure } from '../Store/authSlice';
import { useToast } from '../Context/ToastContext';
import '../styles/Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await api.post('/auth/login', credentials);
            dispatch(loginSuccess(res.data.token));
            showToast("Login Successful", "success");
            navigate('/admin');
        } catch (err) {
            const msg = err.response?.data?.message || "Login Failed";
            dispatch(loginFailure(msg));
            showToast(msg, "error");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className="forgot-password-link">
                        <Link to="/admin/forgot-password">Forgot Password?</Link>
                    </div>
                </form>
                <p className="auth-switch">
                    Don't have an admin account? <Link to="/admin/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
