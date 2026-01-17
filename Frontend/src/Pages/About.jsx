import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000"
          alt="Market"
          className="about-hero-img"
        />
        <div className="about-hero-content">
          <h1>Crafting Joy Since 1990</h1>
          <p>The Journey of Sweet Tooth</p>
        </div>
      </div>

      <main className="about-main">
        <section className="about-section">
          <h2>Our Legacy</h2>
          <p>Nestled in the heart of Kurnool, Sweet Tooth began as a humble family endeavor with a single mission: to preserve the authentic flavors of Indian heritage. For over three decades, we have been more than just a sweet shop; we have been a part of your celebrations, your traditions, and your daily moments of joy.</p>
          <p>Our recipes have been whispered down through generations, ensuring that every bite you take is a tribute to the craftsmen who came before us.</p>
        </section>

        <section className="about-section">
          <h2>The Artisanal Touch</h2>
          <p>We believe that true sweetness cannot be mass-produced. It requires patience, precision, and a touch of passion. Our masters spend hours tempering the milk, roasting the nuts, and perfecting the syrup to achieve that signature "Sweet Tooth" perfection.</p>

          <ul className="specs-list">
            <li className="specs-item">
              <span className="specs-item-icon">🍃</span>
              Authentic Regional Delicacies
            </li>
            <li className="specs-item">
              <span className="specs-item-icon">🥛</span>
              Fresh Pure Milk & Ghee
            </li>
            <li className="specs-item">
              <span className="specs-item-icon">🥜</span>
              Premium Handpicked Dry Fruits
            </li>
            <li className="specs-item">
              <span className="specs-item-icon">✨</span>
              No Artificial Preservatives
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Quality Beyond Measure</h2>
          <div className="commitment-grid">
            <div>
              <p>Your trust is our most valued ingredient. We maintain state-of-the-art hygienic standards, blending traditional methods with modern safety protocols. From our kitchen to your doorstep, quality is never compromised.</p>
            </div>
            <div>
              <p>Whether it's a grand wedding or a simple craving, we promise to deliver the same excellence that has made us Kurnool's favorite sweet destination for 30+ years.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;