import React, { useEffect, useState } from 'react';
import api from "../api/axios";
import { useCart } from '../Context/CartContext';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import homeImg from '../assets/frontend_home_img.jpg';
import { getImageUrl } from '../api/imageUtils';
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
            src={getImageUrl(item.image_url, API_BASE)}
            alt={`${item.item_name} — Buy Online | Sweet Tooth`}
            className="product-image"
            loading="lazy"
            width="300"
            height="300"
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
          src={profile?.Collections_image ? getImageUrl(profile.Collections_image, API_BASE) : homeImg}
          className="hero-image"
          alt="Buy Authentic Indian Sweets, Snacks & Homemade Pickles Online"
          width="1200"
          height="600"
          fetchpriority="high"
        />
        <div className="hero-content">
          <h1>Buy Authentic Indian Sweets, Snacks & Homemade Pickles Online</h1>
          <p>
            Welcome to {profile?.business_name && profile.business_name !== "" ? profile.business_name : "our traditional kitchen"}.
            Enjoy authentic <strong>homemade Indian sweets</strong>, crispy <strong>traditional snacks</strong>, and tangy <strong>natural pickles</strong> made with pure ingredients and no artificial preservatives.
            Order online anywhere in India and experience rich, homemade flavors delivered fresh to your doorstep with <strong>free delivery</strong>.
          </p>
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
                  {Object.entries(groupedData).map(([category, items]) => {
                    let anchorText = category;
                    if (category.toLowerCase() === 'sweets') anchorText = 'Homemade Indian Sweets';
                    if (category.toLowerCase() === 'snacks') anchorText = 'Authentic Snacks & Namkeen';
                    if (category.toLowerCase() === 'pickles') anchorText = 'Traditional Homemade Pickles';
                    return (
                      <Link to={`/${category.toLowerCase()}`} className="singleCat" key={category} title={`Buy ${anchorText} Online`}>
                        <h4>{anchorText}</h4>
                      </Link>
                    );
                  })}
                  <Link to="/gift-boxes" className="singleCat" key="gift-boxes" title="Order Sweets & Pickles Gift Boxes">
                    <h4>Festive Gift Boxes</h4>
                  </Link>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
          <section className="why-choose-us-section" style={{ flex: '1 1 400px', padding: '3rem 2rem', backgroundColor: '#fdfbf7', borderRadius: '12px' }}>
            <div className="section-header">
              <h2>Why Choose Us?</h2>
            </div>
            <p style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', lineHeight: '1.8', fontSize: '1.1rem', color: '#555' }}>
              At {profile?.business_name || "Sweet Tooth"}, we believe that true taste lies in tradition. Every product is crafted using a treasured <strong>family recipe</strong> that has been perfected over decades. We take pride in offering <strong>fresh homemade</strong> delicacies, completely free from artificial colors and <strong>no preservatives</strong>. Every batch is <strong>made with love</strong>, carefully bringing out the <strong>authentic Indian flavors</strong> you grew up with. Experience the warmth of home in every bite, delivered safely from our kitchen to yours.
            </p>
          </section>

          <section className="faq-section" style={{ flex: '1 1 400px', padding: '3rem 2rem' }}>
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>What types of Indian sweets can I order online?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>We offer a wide variety of homemade Indian sweets, including Kaju Katli, traditional laddoos, barfis, and seasonal specialties.</p>
              </details>
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>Do you offer home delivery for pickles and snacks across India?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>Yes! We ship our authentic achaar and crispy namkeen securely across India with fast home delivery.</p>
              </details>
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>Are the sweets and snacks homemade or factory-made?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>All our products are freshly homemade in small batches using traditional family recipes to preserve authentic flavors.</p>
              </details>
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>Can I order a custom sweet hamper or gift box online?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>Yes, we create custom Indian sweets and snacks gift boxes perfect for weddings, corporate gifting, and festive occasions.</p>
              </details>
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>What is the shelf life of your pickles and snacks?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>Our homemade namkeen stays fresh for 3-4 weeks, and traditional pickles last up to 6 months without artificial preservatives.</p>
              </details>
              <details style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>Do you offer bulk orders for weddings and festivals?</summary>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>Absolutely! We cater to bulk orders for traditional Indian sweets and namkeen for Diwali, weddings, and special events.</p>
              </details>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


export default Home;