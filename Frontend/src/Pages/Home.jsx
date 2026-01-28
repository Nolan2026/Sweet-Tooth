import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../styles/Home.css';

function Home() {
  const formatPrice = (price) => `₹${price}`;
  const [data, setData] = useState([]);

  useEffect(() => {
    const allitems = async () => {
      try {
        const res = await axios.get("http://localhost:5016/items");
        setData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error in fetching", error);
      }
    };

    allitems();
  }, []);

  const groupByCategory = (items = []) =>
    items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

  const renderCategory = (title, items = []) => (
    <div className="category-group" key={title}>
      <div className="category-title-container">
        <h3 className="category-title">{title}</h3>
        <div className="category-line"></div>
      </div>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-image-container">
              <span className="product-image-placeholder">🍬</span>
            </div>
            <div className="product-info">
              <h4 className="product-name">{item.item_name}</h4>
              <p className="product-price">{formatPrice(item.price)}<small>/kg</small></p>
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

  const groupedData = groupByCategory(data);

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

        <div className="home-page">
          {Object.entries(groupedData).map(([category, items]) =>
            renderCategory(category, items)
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;