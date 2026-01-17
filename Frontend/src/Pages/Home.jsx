import React from 'react';
import { Regular, MilkSweets, DryFruitSweets, Snacks, CoolSweets } from '../Store/Cost';
import '../styles/Home.css';

function Home() {
  const formatPrice = (price) => `₹${price}`;

  const renderCategory = (title, items) => (
    <div className="category-group">
      <div className="category-title-container">
        <h3 className="category-title">{title}</h3>
        <div className="category-line"></div>
      </div>
      <div className="items-grid">
        {Object.entries(items).map(([name, price]) => (
          <div key={name} className="product-card">
            <div className="product-image-container">
              <span className="product-image-placeholder">🍬</span>
            </div>
            <div className="product-info">
              <h4 className="product-name">{name.replace(/_/g, ' ')}</h4>
              <p className="product-price">{formatPrice(price)}<small>/kg</small></p>
              <button className="add-to-cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <section className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=2000"
          className="hero-image"
          alt="Premium Sweets"
        />
        <div className="hero-content">
          <h2>Indulgence in Every Bite</h2>
          <p>Handcrafted with love, using traditional recipes passed down through generations. Authentic taste, premium ingredients.</p>
          <button className="btn btn-primary">Explore Collection</button>
        </div>
      </section>

      <main className="categories-container">
        <div className="section-header">
          <h2>Our Signature Collections</h2>
          <p>Carefully curated sweets and snacks for every occasion</p>
        </div>

        {renderCategory('Ghee Sweets', Regular)}
        {renderCategory('Milk Delicacies', MilkSweets)}
        {renderCategory('Premium Dry Fruit', DryFruitSweets)}
        {renderCategory('Artisanal Snacks', Snacks)}
        {renderCategory('Chilled Favorites', CoolSweets)}
      </main>
    </div>
  );
}

export default Home;