import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h2>Sweet Tooth</h2>
                    <p>Handcrafting authentic Indian sweets and snacks since 1990. Experience the true taste of heritage with every bite.</p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/log">Account</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Collections</h3>
                    <ul>
                        <li><Link to="/">Ghee Sweets</Link></li>
                        <li><Link to="/">Milk Delicacies</Link></li>
                        <li><Link to="/">Premium Dry Fruits</Link></li>
                        <li><Link to="/">Artisanal Snacks</Link></li>
                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h3>Stay Sweet</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>Subscribe to get special offers and festival updates.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" className="newsletter-input" placeholder="Email Address" />
                        <button type="submit" className="newsletter-btn">Join</button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Sweet Tooth Kurnool. All rights reserved.</p>
                <div className="social-icons">
                    <a href="#" className="social-link">Instagram</a>
                    <a href="#" className="social-link">Facebook</a>
                    <a href="#" className="social-link">WhatsApp</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
