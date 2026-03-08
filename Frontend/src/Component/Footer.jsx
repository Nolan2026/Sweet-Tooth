import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Footer.css';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';


function Footer() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.get("/admin/admin-profile")
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }, []);

    const whatsappLink = profile?.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}` : "#";

    return (
        <footer className="footer-container">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h2>{profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}</h2>
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
                    <h3>Legal</h3>
                    <ul>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                        <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                        <li><Link to="/return-refund-policy">Return & Refund</Link></li>
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
                <p>&copy; 2026 {profile?.business_name && profile.business_name !== "" ? profile.business_name : "Sweet Tooth"}. All rights reserved.</p>
                <div className="social-icons">
                    <a href={profile?.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                        <FaInstagram size={24} style={{ color: 'var(--text-light)' }} />
                    </a>
                    <a href={profile?.facebook_url || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                        <FaFacebook size={24} style={{ color: 'var(--text-light)' }} />
                    </a>
                    <a href={profile?.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}` : "#"} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp">
                        <FaWhatsapp size={24} style={{ color: 'var(--text-light)' }} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;


