import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Store/authSlice';
import api from '../api/axios';
import '../styles/Head.css'

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/admin-profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Admin Header profile load failed", err);
      }
    };
    fetchProfile();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const gohome = () => {
    navigate('/admin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { path: "/admin/bill", label: "Billing", icon: "📄" },
    { path: "/admin/orders", label: "Orders", icon: "🛍️" },
    { path: "/admin/profile", label: "Profile", icon: "👤" },
    { path: "/admin/inventory", label: "Inventory", icon: "📦" },
    { path: "/admin/shipLabel", label: "Ship Label", icon: "🏷️" },
    // { path: "/admin/messages", label: "Messages", icon: "💬" },
    // { path: "/admin/attend", label: "Attendance", icon: "📅" },
    // { path: "/admin/label", label: "Labels", icon: "🔖" },
    // { path: "/admin/history", label: "History", icon: "📊" },
    // { path: "/admin/media", label: "Media", icon: "🖼️" },
    { path: "/admin/add-item", label: "Add Item", icon: "➕" },
    { path: "/admin/coupons", label: "Coupons", icon: "🎫" },
  ];

  return (
    <header className="head">
      <div className="admin-logo-section" onClick={gohome}>
          <h2 className="gradient-text">
            {profile?.business_name && profile.business_name !== "" ? `${profile.business_name} Admin` : "Sweet Tooth"}
          </h2>
      </div>

      {/* Hamburger Menu */}
      <button
        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation */}
      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-label">Logout</span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}
    </header>
  );
}

export default Header;