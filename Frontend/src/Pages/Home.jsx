import React, { useEffect, useState } from 'react';
import api from "../api/axios";
import { useCart } from '../Context/CartContext';
import '../styles/Home.css';
import homeImg from '../assets/frontend_home_img.jpg';
const ProductCard = ({ item }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [added, setAdded] = useState(false);
  const price = Math.round(item.price * selectedWeight);
  const isOutOfStock = !item.isavailable;

  // Use the same base as API for images
  const API_BASE = api.defaults.baseURL;

  const weights = [
    { label: '250g', value: 0.25 },
    { label: '500g', value: 0.5 },
    { label: '1kg', value: 1 },
  ];

  const qty = [
    {}
  ]

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
            src={`${API_BASE}${item.image_url}`}
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
        {item.iskilo ?
          <div className="weight-selector-bar">
            <button
              className="weight-step-btn"
              onClick={() => {
                const idx = weights.findIndex(w => w.value === selectedWeight);
                if (idx > 0) setSelectedWeight(weights[idx - 1].value);
              }}
              disabled={isOutOfStock || selectedWeight === 0.25}
            >
              -
            </button>
            <div className="weight-units-display">
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
              className="weight-step-btn"
              onClick={() => {
                const idx = weights.findIndex(w => w.value === selectedWeight);
                if (idx < weights.length - 1) setSelectedWeight(weights[idx + 1].value);
              }}
              disabled={isOutOfStock || selectedWeight === 1}
            >
              +
            </button>
          </div>
          : <div></div>
        }

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
    <div className="category-group" id={title}>
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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/admin-profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };
    fetchProfile();

    const allitems = async () => {
      try {
        const res = await api.get("/items");
        setData(res.data);
      } catch (error) {
        console.error("Error in fetching", error);
      } finally {
        setLoading(false);
      }
    };
    allitems();
  }, []);

  const API_BASE = api.defaults.baseURL;

  const groupByCategory = (items = []) => {
    const grouped = items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    // Sort items within each category: available first, out-of-stock last
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => Number(b.isavailable) - Number(a.isavailable));
    });

    return grouped;
  };

  const groupedData = groupByCategory(data);

  return (
    <div className="home-page">
      <section className="hero-section">
        <img
          src={profile?.Collections_image ? `${API_BASE}/uploads/${profile.Collections_image}` : homeImg}
          className="hero-image"
          alt="Premium Sweets"
        />
        <div className="hero-content">
          <h2>{profile?.business_name && profile.business_name !== "" ? `Welcome to ${profile.business_name}` : "Indulgence in Every Bite"}</h2>
          <p>Handcrafted with love, using traditional recipes passed down through generations. Authentic taste, premium ingredients.</p>
          <button className="btn btn-primary">Explore Collection</button>
        </div>
      </section>


      <main className="categories-container">
        <div className="section-header">
          <h2>Our Signature Collections</h2>
          <p>Carefully curated sweets and snacks for every occasion</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading collections...</p>
          </div>
        ) : (
          <div className="orders-list">
            {Object.keys(groupedData).length === 0 ? (
              <p className="no-collections">No collections found</p>
            ) : (
              <div className="catalog-container">
                <div className="allCat">
                  {Object.entries(groupedData).map(([category, items]) => (
                    <a href={`#${category}`} className="singleCat" key={category}>
                      <h4>{category}</h4>
                    </a>
                  ))}
                </div>

                <div className="catalog-content">
                  {Object.entries(groupedData).map(([category, items]) => (
                    <CategorySection key={category} title={category} items={items} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


export default Home;