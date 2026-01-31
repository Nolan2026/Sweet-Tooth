import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Head.css'

function Header() {
  const Hom = useNavigate();
  const gohome = () => {
    Hom('/admin');
  };
  return (
    <div className="head">
      <h2 onClick={gohome}>Sweet Tooth Admin</h2>
      <div className="nav-links">
        <Link to="/admin/bill" className="nav-item">Billing</Link>
        <Link to="/admin/uploads" className="nav-item">Uploads</Link>
        <Link to="/admin/inventory" className="nav-item">Inventory </Link>
        <Link to="/admin/attend" className="nav-item">Attendence</Link>
        <Link to='/admin/label' className="nav-item">Labels</Link>
        <Link to="/admin/history" className="nav-item">History</Link>
        <Link to="/admin/add-item" className="nav-item">Add Item</Link>
      </div>
    </div>
  );
}

export default Header;