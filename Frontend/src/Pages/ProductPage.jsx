import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../Context/CartContext';
import useSEO from '../Component/useSEO';
import '../styles/Home.css';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const { addToCart } = useCart();
    const [selectedWeight, setSelectedWeight] = useState(1);
    const [added, setAdded] = useState(false);

    const API_BASE = api.defaults.baseURL;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get('/items');
                const found = res.data.find(item => item.id.toString() === id);
                setProduct(found);

                if (found) {
                    const related = res.data.filter(item => item.category === found.category && item.id !== found.id).slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (err) {
                console.error('Error fetching product', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const weights = [
        { label: '250g', value: 0.25 },
        { label: '500g', value: 0.5 },
        { label: '1kg', value: 1 },
    ];

    const formatPrice = (p) => `₹${p}`;

    const getSeoDescription = (item) => {
        return `Buy authentic ${item.item_name} online. Try our fresh homemade ${item.category} starting at ₹${item.price}. Fast delivery across India. order traditional sweets and snacks securely.`;
    };

    useSEO({
        title: product ? `${product.item_name} — Buy Online | Sweet Tooth` : 'Loading Product...',
        description: product ? getSeoDescription(product) : '',
        url: product ? `https://sweettooth.com/product/${product.id}` : '',
        image: product && product.image_url ? `${API_BASE}${product.image_url}` : undefined
    });

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Product Not Found</h2><Link to="/">Go Home</Link></div>;

    const price = Math.round(product.price * selectedWeight);
    const isOutOfStock = !product.isavailable;

    const handleAddToCart = () => {
        addToCart(product, selectedWeight, price);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="product-page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <div className="breadcrumb-container" style={{ padding: '1rem 2rem' }}>
                <ul className="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList" style={{ listStyle: 'none', display: 'flex', gap: '8px' }}>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link itemProp="item" to="/"><span itemProp="name">Home</span></Link>
                        <meta itemProp="position" content="1" />
                    </li>
                    <li style={{ color: '#888' }}>&gt;</li>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link itemProp="item" to={`/${product.category.toLowerCase()}`}><span itemProp="name">{product.category}</span></Link>
                        <meta itemProp="position" content="2" />
                    </li>
                    <li style={{ color: '#888' }}>&gt;</li>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{product.item_name}</span>
                        <meta itemProp="position" content="3" />
                    </li>
                </ul>
            </div>

            <main className="product-detail-container" style={{ margin: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div className="product-image-section" style={{ flex: '1 1 400px' }}>
                    {product.image_url ? (
                        <img
                            src={`${API_BASE}${product.image_url}`}
                            alt={`${product.item_name} Homemade ${product.category} 500g — Traditional online delivery`}
                            style={{ width: '100%', borderRadius: '12px' }}
                            loading="lazy"
                        />
                    ) : (
                        <div style={{ padding: '80px', background: '#eee', textAlign: 'center', borderRadius: '12px', fontSize: '4rem' }}>🍬</div>
                    )}
                </div>

                <div className="product-info-section" style={{ flex: '1 1 400px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#B3005E' }}>{product.item_name} — Authentic Online Selection</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{formatPrice(price)}</p>
                    <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Enjoy the authentic taste of {product.item_name}. Freshly made with natural ingredients using traditional recipes.
                        Perfect for gifting or personal indulgence. Fast delivery across India.
                    </p>

                    <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '1rem' }}>Last Updated: {new Date().toISOString().split('T')[0]}</p>

                    {product.iskilo && (
                        <div className="weight-selector-bar" style={{ marginBottom: '2rem' }}>
                            <button className="weight-step-btn" onClick={() => { const idx = weights.findIndex(w => w.value === selectedWeight); if (idx > 0) setSelectedWeight(weights[idx - 1].value); }} disabled={isOutOfStock || selectedWeight === 0.25}>-</button>
                            <div className="weight-units-display">
                                {weights.map((w) => (
                                    <button key={w.label} className={`weight-unit-btn ${selectedWeight === w.value ? 'active' : ''}`} onClick={() => setSelectedWeight(w.value)} disabled={isOutOfStock}>{w.label}</button>
                                ))}
                            </div>
                            <button className="weight-step-btn" onClick={() => { const idx = weights.findIndex(w => w.value === selectedWeight); if (idx < weights.length - 1) setSelectedWeight(weights[idx + 1].value); }} disabled={isOutOfStock || selectedWeight === 1}>+</button>
                        </div>
                    )}

                    <button className={`add-to-cart-btn btn btn-primary ${added ? 'added' : ''}`} onClick={handleAddToCart} disabled={isOutOfStock} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
                        {added ? 'Added to Cart!' : (isOutOfStock ? 'Currently Unavailable' : 'Add to Cart')}
                    </button>
                </div>
            </main>

            {relatedProducts.length > 0 && (
                <section className="related-products-section" style={{ padding: '4rem 2rem' }}>
                    <h2>Related Homemade {product.category} Offers</h2>
                    <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                        {relatedProducts.map(rel => (
                            <div key={rel.id} className="product-card">
                                <Link to={`/product/${rel.id}`} className="product-image-container" style={{ display: 'block' }}>
                                    {rel.image_url ? (
                                        <img src={`${API_BASE}${rel.image_url}`} alt={`${rel.item_name} online`} className="product-image" loading="lazy" />
                                    ) : (
                                        <span className="product-image-placeholder">🍬</span>
                                    )}
                                </Link>
                                <div className="product-info">
                                    <h4><Link to={`/product/${rel.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{rel.item_name}</Link></h4>
                                    <p className="dynamic-price">{formatPrice(rel.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductPage;
