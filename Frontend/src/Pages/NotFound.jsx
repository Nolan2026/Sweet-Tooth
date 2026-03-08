import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../Component/useSEO';

const NotFound = () => {
    useSEO({
        title: 'Page Not Found - 404 | Sweet Tooth',
        description: 'We could not find the authentic Indian sweets or snacks page you requested.',
    });

    return (
        <div style={{ textAlign: 'center', padding: '150px 20px', minHeight: '80vh' }}>
            <h1 style={{ color: '#B3005E', fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#555' }}>We couldn't find the page you were looking for.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Home</Link>
                <Link to="/sweets" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Homemade Sweets</Link>
                <Link to="/snacks" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Authentic Snacks</Link>
                <Link to="/pickles" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Traditional Pickles</Link>
            </div>
        </div>
    );
};

export default NotFound;
