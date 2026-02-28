import React from 'react';
import '../styles/Policy.css';

const TermsAndConditions = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Terms and Conditions</h1>
                </header>
                <div className="policy-content">
                    <p>Welcome to Sweet Tooth! These terms and conditions outline the rules and regulations for the use of our website. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Sweet Tooth if you do not agree to all of the terms and conditions stated on this page.</p>

                    <h2>1. Intellectual Property Rights</h2>
                    <p>Unless otherwise stated, Sweet Tooth and/or its licensors own the intellectual property rights for all material on Sweet Tooth. All intellectual property rights are reserved. You may access this from Sweet Tooth for your own personal use subjected to restrictions set in these terms and conditions.</p>

                    <h2>2. Restricted Use</h2>
                    <p>You must not:</p>
                    <ul>
                        <li>Republish material from Sweet Tooth</li>
                        <li>Sell, rent or sub-license material from Sweet Tooth</li>
                        <li>Reproduce, duplicate or copy material from Sweet Tooth</li>
                        <li>Redistribute content from Sweet Tooth</li>
                    </ul>

                    <h2>3. User Accounts</h2>
                    <p>If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>

                    <h2>4. Availability and Pricing</h2>
                    <p>All products listed on the website are subject to availability. Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>

                    <h2>5. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

                    <h2>6. Modifications to Terms</h2>
                    <p>We reserve the right to revise these terms and conditions at any time. By using this website you are expected to review these terms and conditions on a regular basis.</p>
                </div>
                <span className="last-updated">Last Updated: February 28, 2026</span>
            </div>
        </div>
    );
};

export default TermsAndConditions;
