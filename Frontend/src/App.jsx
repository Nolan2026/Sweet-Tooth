import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { ToastProvider } from './Context/ToastContext';
import Header from './Component/Header';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import Login from './Component/Login';
import Payment from './Pages/Payment';
import Footer from './Component/Footer';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import ShippingPolicy from './Pages/ShippingPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import RefundPolicy from './Pages/RefundPolicy';
import './App.css';

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/log" element={<Login />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/return-refund-policy" element={<RefundPolicy />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;

