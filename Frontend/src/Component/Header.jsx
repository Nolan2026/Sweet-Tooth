import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Head.css'

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-container glass">
      <Link to="/" className="logo-link">
        <h1 className="logo-text">Sweet Tooth</h1>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-item">Collections</Link>
        <Link to="/about" className="nav-item">Our Story</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </nav>

      <div className="auth-buttons">
        <Link to="/cart" className="cart-btn">
          <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Cart
        </Link>
        <Link to="/log" className="login-btn">Login</Link>
      </div>
    </header>
  );
}

export default Header;