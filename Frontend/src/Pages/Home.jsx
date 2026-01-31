import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useCart } from '../Context/CartContext';
import '../styles/Home.css';

const ProductCard = ({ item }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(1); // 1 = 1kg, 0.5 = 500g, 0.25 = 250g
  const [added, setAdded] = useState(false);
  const price = Math.round(item.price * selectedWeight);
  const isOutOfStock = !item.availability;

  const weights = [
    { label: '250g', value: 0.25 },
    { label: '500g', value: 0.5 },
    { label: '1kg', value: 1 },
  ];

  const formatPrice = (p) => `₹${p}`;

  const handleAddToCart = () => {
    addToCart(item, selectedWeight, price);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${item.image_url ? 'has-image' : ''}`}>
      <div className="product-image-container">
        {item.image_url ? (
          <img
            src={`http://localhost:5016${item.image_url}`}
            alt={item.item_name}
            className="product-image"
          />
        ) : (
          <span className="product-image-placeholder">🍬</span>
        )}
      </div>

      <div className="product-info">
        <h4 className="product-name">{item.item_name}</h4>
        <p className="dynamic-price">{formatPrice(price)}</p>

        <div className="weight-selector-bar">
          {weights.map((w) => (
            <button
              key={w.label}
              className={`weight-unit-btn ${selectedWeight === w.value ? 'active' : ''}`}
              onClick={() => setSelectedWeight(w.value)}
              disabled={isOutOfStock}
            >
              {w.label}
            </button>
          ))}
        </div>


        <button
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {added ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};


const CategorySection = ({ title, items }) => {
  return (
    <div className="category-group">
      <div className="category-title-container">
        <h3 className="category-title">{title}</h3>
        <div className="category-line"></div>
      </div>
      <div className="scroll-container">
        <div className="items-grid">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
        <div className="fade-edge right"></div>
      </div>
    </div>
  );
};



function Home() {
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

        <div className="catalog-content">
          {Object.entries(groupedData).map(([category, items]) => (
            <CategorySection key={category} title={category} items={items} />
          ))}
        </div>
      </main>
    </div>
  );
}


export default Home;