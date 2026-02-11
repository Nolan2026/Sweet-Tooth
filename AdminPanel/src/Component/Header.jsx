import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Store/authSlice';
import api from '../api/axios';
import '../styles/Head.css'

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const gohome = () => {
    navigate('/admin');
  };

  return (
    <div className="head">
      <div className="admin-logo-section" onClick={gohome} style={{ cursor: 'pointer' }}>
        {profile?.backend_logo ? (
          <img
            src={`${BASE}/uploads/${profile.backend_logo}`}
            alt={profile.business_name}
            className="admin-header-logo"
          />
        ) : (
          <h2>{profile?.business_name && profile.business_name !== "" ? `${profile.business_name} Admin` : "Sweet Tooth Admin"}</h2>
        )}
      </div>
      <div className="nav-links">
        <Link to="/admin/bill" className="nav-item">Billing</Link>
        <Link to="/admin/orders" className="nav-item">Orders</Link>
        <Link to="/admin/messages" className="nav-item">Messages</Link>
        <Link to="/admin/admin-profile" className="nav-item">Admin Profile</Link>
        <Link to="/admin/inventory" className="nav-item">Inventory </Link>
        <Link to="/admin/shipLabel" className="nav-item">Ship Label</Link>
        <Link to="/admin/attend" className="nav-item">Attendence</Link>
        <Link to='/admin/label' className="nav-item">Labels</Link>
        <Link to="/admin/history" className="nav-item">History</Link>
        <Link to="/admin/add-item" className="nav-item">Add Item</Link>
        <Link to="/admin/coupons" className="nav-item">Coupons</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}


export default Header;