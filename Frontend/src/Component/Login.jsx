import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "../Context/ToastContext";
import "../styles/Form.css";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const from = location.state?.from || "/";

  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpType, setOtpType] = useState(""); // 'register' or 'login'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
    setError("");
  };

  const register = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        panel: 'USER'
      });
      showToast(res.data.message || "OTP sent to your email", "success");
      setOtpSent(true);
      setOtpType("register");
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });
      if (res.data.requiresOtp) {
        showToast(res.data.message || "OTP sent to your email", "success");
        setOtpSent(true);
        setOtpType("login");
      } else {
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('authChange'));
        showToast("Login successful!", "success");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        email: formData.email,
        otp,
        type: otpType
      });
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('authChange'));
      showToast(res.data.message || "Successful!", "success");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("OTP verification error:", error);
      const msg = error.response?.data?.message || "Verification failed";
      setError(msg);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpSent) {
      handleVerifyOtp();
      return;
    }

    if (action === "Login") {
      if (!formData.email || !formData.password) {
        setError("Please enter your credentials.");
        return;
      }
      login();
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError("All fields are required.");
        return;
      }
      register();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h2>{action}</h2>
          <p>
            {otpSent
              ? `Verification code sent to ${formData.email}`
              : (action === "Login" ? "Welcome back to Sweet Tooth" : "Join our sweet community today")}
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            {!otpSent ? (
              <>
                {action === "Sign up" && (
                  <input
                    type="text"
                    name="name"
                    className="login-input"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                )}

                <input
                  type="email"
                  name="email"
                  className="login-input"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />

                {action === "Sign up" && (
                  <input
                    type="text"
                    name="phone"
                    className="login-input"
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                )}

                <input
                  type="password"
                  name="password"
                  className="login-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </>
            ) : (
              <div className="otp-group">
                <label className="otp-label">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  className="login-input otp-input"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  autoFocus
                />
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="login-actions">
            <button
              type="submit"
              className="primary-auth-btn"
              disabled={loading || (otpSent && otp.length !== 6)}
            >
              {loading
                ? "Processing..."
                : (otpSent ? "Verify OTP" : (action === "Login" ? "Sign In" : "Create Account"))
              }
            </button>

            {otpSent && (
              <button type="button" className="toggle-btn resend-btn" onClick={handleResendOtp}>
                Resend OTP
              </button>
            )}

            {!otpSent && (
              <div className="auth-toggle">
                <span>{action === "Login" ? "New here?" : "Already have an account?"}</span>
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setAction(action === "Login" ? "Sign up" : "Login");
                    setError("");
                  }}
                >
                  {action === "Login" ? "Sign Up" : "Login"}
                </button>
              </div>
            )}

            {action === "Login" && !otpSent && (
              <Link to="/forgot-password" size="small" className="forgot-pw">Forgot your password?</Link>
            )}

            {otpSent && (
              <button
                type="button"
                className="toggle-btn back-btn"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                Back to {action}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}