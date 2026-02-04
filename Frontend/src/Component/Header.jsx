import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import '../styles/Head.css'

function Header() {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));

  console.log("Header rendering, isLoggedIn:", isLoggedIn);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('userToken'));
    };
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <header className="header-container glass">
        <div className="header-left">
          <button
            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <Link to="/" className="logo-link">
            <h1 className="logo-text">Sweet Tooth</h1>
          </Link>
        </div>

        <nav className={`nav-links ${isMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>Collections</Link>
          <Link to="/about" className="nav-item" onClick={() => setIsMenuOpen(false)}>Our Story</Link>
          <Link to="/contact" className="nav-item" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {isLoggedIn && <Link to="/profile" className="nav-item mobile-only" onClick={() => setIsMenuOpen(false)}>My Profile</Link>}
        </nav>

        <div className="auth-buttons">
          <Link to="/cart" className="cart-btn">
            <div className="cart-icon-wrapper">
              <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
            </div>
            <span className="cart-text">Cart</span>
          </Link>
          {isLoggedIn ? (
            <div className="auth-user-links">
              <Link to="/profile" className="login-btn profile-link-btn">Profile</Link>
              <button onClick={handleLogout} className="logout-btn-nav">Logout</button>
            </div>
          ) : (
            <Link to="/log" className="login-btn">Login</Link>
          )}
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>}
    </>
  );
}

export default Header;