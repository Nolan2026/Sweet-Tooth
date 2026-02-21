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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const register = async () => {
    try {
      const res = await api.post("/auth/register", {
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      showToast("Registration successful! You can now login.", "success");
      setAction("Login");
      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message || "Registration failed";
      const detail = error.response?.data?.error ? ` (${error.response.data.error})` : "";
      setError(msg + detail);
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('authChange'));
      showToast("Login successful!", "success");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Login failed";
      const detail = error.response?.data?.error ? ` (${error.response.data.error})` : "";
      setError(msg + detail);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <p>{action === "Login" ? "Welcome back to Sweet Tooth" : "Join our sweet community today"}</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
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
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="login-actions">
            <button type="submit" className="primary-auth-btn">
              {action === "Login" ? "Sign In" : "Create Account"}
            </button>

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

            {action === "Login" && (
              <Link to="/forgot-password" size="small" className="forgot-pw">Forgot your password?</Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}