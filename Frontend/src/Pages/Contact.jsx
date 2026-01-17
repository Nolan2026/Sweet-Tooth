import React from 'react';
import '../styles/Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="section-header">
        <h1>Connect with Us</h1>
        <p>Whether it's a bulk order for a wedding or just a quick question, we're here to help.</p>
      </div>

      <div className="contact-grid">
        <aside className="contact-info-card">
          <div className="info-item">
            <h3>Visit Our Flagship Store</h3>
            <p>Sweet Tooth Main Road,<br />Near City Center, Kurnool,<br />Andhra Pradesh 518001</p>
          </div>

          <div className="info-item">
            <h3>Talk to Our Sweet Masters</h3>
            <p>Primary: +91 98765 43210<br />WhatsApp: +91 98765 43210</p>
          </div>

          <div className="info-item">
            <h3>Email & Social</h3>
            <p>hello@sweettoothkurnool.com<br />@SweetToothKurnool</p>
          </div>

          <div className="info-item">
            <h3>Business Hours</h3>
            <p>Mon - Sat: 8:00 AM - 9:00 PM<br />Sun & Holidays: 9:00 AM - 8:00 PM</p>
          </div>
        </aside>

        <main className="contact-form-card">
          <h2>Send a Message</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" className="form-input" placeholder="Your Email" required />
              </div>
            </div>

            <div className="form-group">
              <input type="text" className="form-input" placeholder="Subject (e.g., Bulk Order, Feedback)" />
            </div>

            <div className="form-group">
              <textarea className="form-input" placeholder="How can we make your day sweeter?"></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Contact;