import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import useSEO from '../Component/useSEO';
import { useCart } from '../Context/CartContext';
import '../styles/Home.css'; // Re-use Home styles for consistency

// A mini ProductCard to avoid repeating code, or better just copy from Home.jsx
const ProductCard = ({ item }) => {
    const { addToCart } = useCart();
    const [selectedWeight, setSelectedWeight] = useState(1);
    const [added, setAdded] = useState(false);
    const price = Math.round(item.price * selectedWeight);
    const isOutOfStock = !item.isavailable;
    const API_BASE = api.defaults.baseURL;

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
            <Link to={`/product/${item.id}`} className="product-image-container" style={{ display: 'block' }}>
                {item.image_url ? (
                    <img
                        src={`${API_BASE}${item.image_url}`}
                        alt={`${item.item_name} — Buy Online | Sweet Tooth`}
                        className="product-image"
                        loading="lazy"
                        width="300"
                        height="300"
                    />
                ) : (
                    <span className="product-image-placeholder">🍬</span>
                )}
            </Link>

            <div className="product-info">
                <h4 className="product-name"><Link to={`/product/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.item_name}</Link></h4>
                <p className="dynamic-price">{formatPrice(price)}</p>
                {item.iskilo ?
                    <div className="weight-selector-bar">
                        <button className="weight-step-btn" onClick={() => { const idx = weights.findIndex(w => w.value === selectedWeight); if (idx > 0) setSelectedWeight(weights[idx - 1].value); }} disabled={isOutOfStock || selectedWeight === 0.25}>-</button>
                        <div className="weight-units-display">
                            {weights.map((w) => (
                                <button key={w.label} className={`weight-unit-btn ${selectedWeight === w.value ? 'active' : ''}`} onClick={() => setSelectedWeight(w.value)} disabled={isOutOfStock}>{w.label}</button>
                            ))}
                        </div>
                        <button className="weight-step-btn" onClick={() => { const idx = weights.findIndex(w => w.value === selectedWeight); if (idx < weights.length - 1) setSelectedWeight(weights[idx + 1].value); }} disabled={isOutOfStock || selectedWeight === 1}>+</button>
                    </div> : <div style={{ height: '40px' }}></div>
                }
                <button className={`add-to-cart-btn ${added ? 'added' : ''}`} onClick={handleAddToCart} disabled={isOutOfStock}>
                    {added ? 'Added!' : (isOutOfStock ? 'Unavailable' : 'Add to Cart')}
                </button>
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Map slugs to display names and SEO data
    const categoryMap = {
        'sweets': {
            name: 'Sweets',
            h1: 'Order Fresh Homemade Indian Sweets Online — Mithai Delivered to Your Door',
            title: 'Buy Homemade Indian Sweets Online | Sweet Tooth',
            description: 'Order authentic traditional Indian sweets online. Fresh homemade mithai with free delivery across India.',
            crossLinks: [{ path: '/snacks', label: 'authentic snacks' }, { path: '/pickles', label: 'traditional homemade pickles' }, { path: '/gift-boxes', label: 'gift boxes' }]
        },
        'snacks': {
            name: 'Snacks',
            h1: 'Buy Authentic Indian Namkeen & Snacks Online with Fast Delivery',
            title: 'Buy Authentic Indian Namkeen & Snacks Online | Sweet Tooth',
            description: 'Shop fresh, crispy, homemade Indian snacks and namkeen. Authentic traditional recipes from Sweet Tooth delivered to your door.',
            crossLinks: [{ path: '/sweets', label: 'homemade Indian sweets' }, { path: '/pickles', label: 'authentic achaar' }, { path: '/gift-boxes', label: 'gift boxes' }]
        },
        'pickles': {
            name: 'Pickles',
            h1: 'Shop Traditional Homemade Pickles Online — Authentic Achaar Delivered Fresh',
            title: 'Buy Traditional Homemade Pickles Online | Authentic Achaar',
            description: 'Buy authentic homemade Indian pickles online. Shop traditional achaar without preservatives. Fast delivery from Sweet Tooth.',
            crossLinks: [{ path: '/sweets', label: 'homemade mithai' }, { path: '/snacks', label: 'crispy namkeen snacks' }, { path: '/gift-boxes', label: 'gift boxes' }]
        },
        'gift-boxes': {
            name: 'Gift Boxes',
            h1: 'Order Traditional Pickles and Sweets Gift Box Online India',
            title: 'Best Indian Sweets and Pickles Gift Box Online | Sweet Tooth',
            description: 'Perfect gift boxes of traditional Indian sweets, snacks, and pickles for weddings, festivals, and parties. Shop online now.',
            crossLinks: [{ path: '/sweets', label: 'fresh sweets' }, { path: '/snacks', label: 'authentic snacks' }, { path: '/pickles', label: 'pickles' }]
        }
    };

    const currentCat = categoryMap[categorySlug] || {
        name: categorySlug,
        h1: `${categorySlug} — Buy Online`,
        title: `${categorySlug} | Sweet Tooth`,
        description: `Shop our amazing ${categorySlug} collection today.`,
        crossLinks: []
    };

    useSEO({
        title: currentCat.title,
        description: currentCat.description,
        url: `https://sweettooth.com/${categorySlug}`
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get('/items');
                const dbCategoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' ');
                const filtered = res.data.filter(item => item.category.toLowerCase() === dbCategoryName.toLowerCase() || item.category.toLowerCase() === categorySlug.toLowerCase());
                setItems(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [categorySlug]);

    return (
        <div className="home-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="breadcrumb-container" style={{ padding: '1rem 2rem' }}>
                <ul className="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList" style={{ listStyle: 'none', display: 'flex', gap: '8px' }}>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link itemProp="item" to="/"><span itemProp="name">Home</span></Link>
                        <meta itemProp="position" content="1" />
                    </li>
                    <li style={{ color: '#888' }}>&gt;</li>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{currentCat.name}</span>
                        <meta itemProp="position" content="2" />
                    </li>
                </ul>
            </div>

            <main className="categories-container" style={{ marginTop: '0' }}>
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#B3005E' }}>{currentCat.h1}</h1>
                </div>

                {loading ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                ) : (
                    <div className="category-group" style={{ margin: '0 2rem' }}>
                        <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {items.length > 0 ? items.map(item => (
                                <ProductCard key={item.id} item={item} />
                            )) : (
                                <p>No products found in this category.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="cross-links" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h3>Explore More Authentic Delicacies</h3>
                    <p style={{ marginTop: '1rem' }}>
                        Looking for something else? Pair your order with our{' '}
                        {currentCat.crossLinks.map((link, idx) => (
                            <span key={link.path}>
                                <Link to={link.path} style={{ color: '#B3005E', textDecoration: 'underline' }}>{link.label}</Link>
                                {idx < currentCat.crossLinks.length - 2 ? ', ' : idx === currentCat.crossLinks.length - 2 ? ' or ' : '.'}
                            </span>
                        ))}
                    </p>
                </div>
            </main>
        </div>
    );
};

export default CategoryPage;
