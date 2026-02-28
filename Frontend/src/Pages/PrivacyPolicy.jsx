import React from 'react';
import '../styles/Policy.css';

const PrivacyPolicy = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Privacy Policy</h1>
                </header>
                <div className="policy-content">
                    <p>At Sweet Tooth, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sweet Tooth and how we use it.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information such as your name, email address, phone number, and delivery address when you register on our site or place an order. This is necessary to provide you with our products and services.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect in various ways, including to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Communicate with you, either directly or through one of our partners</li>
                        <li>Process your transactions and send you related information</li>
                        <li>Send you emails relating to your order or promotional offers</li>
                    </ul>

                    <h2>3. Cookies and Web Beacons</h2>
                    <p>Like any other website, Sweet Tooth uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>

                    <h2>4. Our Advertising Partners</h2>
                    <p>Some of advertisers on our site may use cookies and web beacons. Each of our advertising partners has their own Privacy Policy for their policies on user data.</p>

                    <h2>5. Contact Us</h2>
                    <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at contact@sweettooth.com.</p>
                </div>
                <span className="last-updated">Last Updated: February 28, 2026</span>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
