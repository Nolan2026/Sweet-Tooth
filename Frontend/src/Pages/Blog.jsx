import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSEO from '../Component/useSEO';
import '../styles/Home.css';

const blogPosts = [
    {
        id: "10-best-indian-sweets-to-gift-during-diwali",
        title: "10 Best Indian Sweets to Gift During Diwali in 2025",
        metaTitle: "10 Best Indian Sweets to Gift During Diwali 2025 | Sweet Tooth",
        description: "Discover the 10 best traditional homemade Indian sweets that make perfect Diwali gifts. Order delicious mithai online for festive gifting.",
        content: (
            <>
                <h1>10 Best Indian Sweets to Gift During Diwali in 2025</h1>
                <p>Diwali, the festival of lights, is incomplete without the traditional exchange of <strong>homemade Indian sweets</strong>. As 2025 approaches, selecting the perfect gift box of <strong>authentic mithai</strong> for your loved ones becomes a joyful tradition.</p>
                <p>From the delicate richness of Kaju Katli to the comforting warmth of Besan Ladoo, giving traditional sweets carries a profound cultural significance. When you <strong>order Indian sweets online</strong>, you ensure that distance doesn't stop you from sharing these delightful treats.</p>
                <h2>Why Choose Homemade Sweets?</h2>
                <p>Unlike factory-made alternatives, homemade sweets are crafted with pure ghee, fresh ingredients, and zero preservatives. They capture the essence of a family kitchen. Gifting these signifies love and prosperity. Check out our curated list of the top 10 authentic sweets you should consider gifting this festive season!</p>
            </>
        )
    },
    {
        id: "homemade-pickles-vs-store-bought-achaar",
        title: "How Homemade Pickles Are Better Than Store-Bought Achaar",
        metaTitle: "Homemade vs Store-Bought Achaar: Which is Better? | Sweet Tooth",
        description: "Learn why traditional homemade Indian pickles are superior to store-bought achaar. Shop authentic, preservative-free pickles online.",
        content: (
            <>
                <h1>How Homemade Pickles Are Better Than Store-Bought Achaar</h1>
                <p>In Indian households, the tangy, spicy punch of <strong>authentic achaar</strong> transforms any simple meal into a feast. But with so many options available when you <strong>buy homemade Indian pickles online</strong>, is it better to choose artisanal homemade jars over supermarket equivalents?</p>
                <p>The secret lies in the fermentation process and the ingredients. Factory-produced pickles often rely on synthetic vinegars and artificial preservatives to extend shelf life. In contrast, traditional homemade pickles strictly use natural oils, sea salt, and sun-drying techniques handed down through generations.</p>
                <h2>The Taste of Authenticity</h2>
                <p><strong>Traditional Indian pickles</strong> offer a deeply developed flavor profile that commercial brands cannot replicate. We explore the age-old techniques that preserve both the nutrients and the intense flavors of mango, lime, and mixed vegetables without harmful additives.</p>
            </>
        )
    },
    {
        id: "top-7-indian-snacks-for-evening-tea",
        title: "Top 7 Indian Snacks That Are Perfect for Evening Tea",
        metaTitle: "Top 7 Authentic Indian Namkeen Snacks for Evening Tea | Sweet Tooth",
        description: "Explore the best traditional Indian namkeen and snacks to pair with your evening tea. Buy authentic crispy snacks online with fast delivery.",
        content: (
            <>
                <h1>Top 7 Indian Snacks That Are Perfect for Evening Tea</h1>
                <p>The ritual of evening tea or 'Chai' time is a beloved part of Indian culture. It is the perfect moment to pause, chat, and crunch on some delicious, perfectly spiced <strong>authentic snacks</strong>. If you want to <strong>buy namkeen online</strong>, you need to know which ones perfectly complement your warm cup.</p>
                <p>Whether you prefer the light crispiness of poha chivda or the robust crunch of traditional murukku, there is a snack for every palate. The beauty of these Indian delicacies is in their balance of spices—never overpowering, yet always flavorful.</p>
                <h2>Our Top Crunchy Picks</h2>
                <p>We've ranked the top 7 homemade namkeen that you must try. Made with fresh ingredients and traditional recipes, these snacks will elevate your daily and weekend tea sessions instantly!</p>
            </>
        )
    },
    {
        id: "how-to-store-indian-sweets-pickles",
        title: "How to Store Indian Sweets and Pickles to Keep Them Fresh Longer",
        metaTitle: "How to Store Indian Sweets & Pickles | Freshness Tips | Sweet Tooth",
        description: "Keep your authentic Indian sweets and homemade pickles fresh longer with our ultimate storage guide. Learn practical tips and tricks.",
        content: (
            <>
                <h1>How to Store Indian Sweets and Pickles to Keep Them Fresh Longer</h1>
                <p>When you invest in high-quality, <strong>traditional Indian sweets</strong> or a fresh jar of <strong>homemade achaar online</strong>, knowing how to store them is crucial. Because authentic products skip synthetic preservatives, their storage requirements are completely different from mass-produced items.</p>
                <p>Moisture is the biggest enemy of both crispy namkeen and oil-based pickles. From using clean, dry spoons for your pickles to understanding which milk-based sweets require immediate refrigeration, proper storage extends the life and taste of your food significantly.</p>
                <h2>Essential Storage Techniques</h2>
                <p>In this guide, we break down the most effective storage techniques. You'll learn the difference between room temperature safe sweets (like besan ladoos) and highly perishable delicacies, ensuring your treats stay delightfully fresh until the very last bite.</p>
            </>
        )
    },
    {
        id: "best-indian-sweet-hampers-weddings",
        title: "Best Indian Sweet Hampers to Order Online for Weddings & Festivals",
        metaTitle: "Best Indian Sweet Hampers for Weddings & Festivals | Sweet Tooth",
        description: "Order elegant, traditional Indian sweet hampers online. Perfect for weddings, festivals, and corporate gifting. Free delivery across India.",
        content: (
            <>
                <h1>Best Indian Sweet Hampers to Order Online for Weddings & Festivals</h1>
                <p>No Indian wedding or grand festival is truly complete without the generous sharing of sweets. Finding the perfect <strong>sweets gift box online</strong> that beautifully balances tradition and elegance is essential for making a lasting impression.</p>
                <p>As modern celebrations evolve, the demand for beautifully packaged <strong>authentic Indian sweets</strong> and premium snacks has grown. High-quality hampers not only look stunning but offer a variety of flavors—from rich, decadent mithai to subtly spiced namkeen—that cater to all guests.</p>
                <h2>Curating the Perfect Gift Box</h2>
                <p>We explore what makes a sweet hamper truly special. Whether you are ordering bulk favors for a wedding or seeking luxurious festival gifts, discover how traditional recipes provide the ultimate premium gifting experience.</p>
            </>
        )
    }
];

export const BlogPostPage = () => {
    const { slug } = useParams();
    const post = blogPosts.find(p => p.id === slug);

    if (!post) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Blog Post Not Found</h2><Link to="/blog">Back to Blog</Link></div>;

    useSEO({
        title: post.metaTitle,
        description: post.description,
        url: `https://sweettooth.com/blog/${post.id}`
    });

    return (
        <article className="blog-post" style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 2rem 4rem', lineHeight: '1.8' }}>
            <div className="breadcrumb-container" style={{ marginBottom: '2rem' }}>
                <ul className="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList" style={{ listStyle: 'none', display: 'flex', gap: '8px', padding: 0 }}>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link itemProp="item" to="/"><span itemProp="name">Home</span></Link>
                        <meta itemProp="position" content="1" />
                    </li>
                    <li style={{ color: '#888' }}>&gt;</li>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link itemProp="item" to="/blog"><span itemProp="name">Blog</span></Link>
                        <meta itemProp="position" content="2" />
                    </li>
                    <li style={{ color: '#888' }}>&gt;</li>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{post.title}</span>
                        <meta itemProp="position" content="3" />
                    </li>
                </ul>
            </div>

            {post.content}

            <div style={{ marginTop: '3rem', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                <h3>Craving Authentic Flavors?</h3>
                <p>Experience the very best of tradition directly from our kitchen.</p>
                <Link to="/sweets" className="btn btn-primary" style={{ marginRight: '1rem', display: 'inline-block', marginTop: '1rem' }}>Shop Sweets</Link>
                <Link to="/pickles" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Shop Pickles</Link>
            </div>
        </article>
    );
};

const BlogIndexPage = () => {
    useSEO({
        title: 'Indian Sweets & Snacks Blog | Tips, Recipes & Guides | Sweet Tooth',
        description: 'Read the latest beautifully curated articles about traditional Indian sweets, snacks, and homemade pickles on the Sweet Tooth blog.',
        url: 'https://sweettooth.com/blog'
    });

    return (
        <div className="blog-index" style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 2rem 4rem' }}>
            <h1 style={{ color: '#B3005E', marginBottom: '2rem' }}>Sweet Tooth Journal: Exploring Authenticity</h1>
            <div className="blog-grid" style={{ display: 'grid', gap: '2rem' }}>
                {blogPosts.map(post => (
                    <div key={post.id} className="blog-card" style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px' }}>
                        <h2 style={{ marginBottom: '1rem' }}><Link to={`/blog/${post.id}`} style={{ color: '#333', textDecoration: 'none' }}>{post.title}</Link></h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>{post.description}</p>
                        <Link to={`/blog/${post.id}`} style={{ color: '#B3005E', fontWeight: 'bold' }}>Read SEO Article →</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogIndexPage;
