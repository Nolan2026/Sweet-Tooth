import React, { useState } from "react";
import "../styles/Form.css";

export default function Login() {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === "Login") {
      if (!formData.email || !formData.password) {
        setError("Please enter your credentials.");
        return;
      }
      console.log("Logging in...");
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required.");
        return;
      }
      console.log("Signing up...");
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
              <a href="#" className="forgot-pw">Forgot your password?</a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}