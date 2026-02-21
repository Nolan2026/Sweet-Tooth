import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Context/ToastContext';
import '../styles/Contact.css';

function Contact() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5016/admin/admin-profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5016/contact/submit', formData);
      showToast(response.data.message, 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      showToast(error.response?.data?.message || 'Failed to send message.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="section-header">
        <h1>Connect with Us</h1>
        <p>Whether it's a bulk order for a wedding or just a quick question, we're here to help.</p>
      </div>

      <div className="contact-grid">
        <aside className="contact-info-card">
          <div className="info-item">
            <h3><span>📍</span> Visit Our Flagship Store</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{profile?.address || "Sweet Tooth Main Road,\nNear City Center, Kurnool,\nAndhra Pradesh 518001"}</p>
          </div>

          <div className="info-item">
            <h3><span>📞</span> Talk to Our Sweet Masters</h3>
            <p>
              Primary: {profile?.phone || "+91 98765 43210"}<br />
              WhatsApp: {profile?.whatsapp || "+91 98765 43210"}
            </p>
          </div>

          <div className="info-item">
            <h3><span>📧</span> Email & Social</h3>
            <p>
              {profile?.business_email || "hello@sweettoothkurnool.com"}<br />
              {profile?.instagram_url && <span>Instagram: {profile.instagram_url.split('/').pop()}</span>}
            </p>
          </div>

          <div className="info-item">
            <h3><span>⏰</span> Business Hours</h3>
            <p>Mon - Sat: 8:00 AM - 9:00 PM<br />Sun & Holidays: 9:00 AM - 8:00 PM</p>
          </div>
        </aside>


        <main className="contact-form-card">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="Subject (e.g., Bulk Order, Feedback)"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                className="form-input"
                placeholder="How can we make your day sweeter?"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Contact;