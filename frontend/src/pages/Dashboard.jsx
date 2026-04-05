import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const fetchNews = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:5000/api/news', { params });
            // NewsAPI occasionally returns removed articles; we filter them out for a clean UI
            const validArticles = res.data.filter(a => a.title !== '[Removed]');
            setArticles(validArticles);
        } catch (err) {
            setError('Failed to fetch the latest intelligence. Please try again later.');
            console.error('Failed to fetch news:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews({ category: 'technology' });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchNews({ query: searchQuery.trim() });
        }
    };

    const handleCategoryClick = (category) => {
        setSearchQuery('');
        fetchNews({ category });
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Search global headlines (e.g., AI, Space, Markets)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flexGrow: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <button type="submit" style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                        Search
                    </button>
                </form>

                <div className="category-filters">
                    <button onClick={() => handleCategoryClick('technology')}>Technology</button>
                    <button onClick={() => handleCategoryClick('business')}>Business</button>
                    <button onClick={() => handleCategoryClick('science')}>Science</button>
                </div>

                {error && <p style={{ color: '#dc2626', marginTop: '20px' }}>{error}</p>}

                {loading ? (
                    <p style={{ marginTop: '20px', color: '#4b5563' }}>Aggregating latest intelligence...</p>
                ) : (
                    <div className="news-grid">
                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <NewsCard key={index} article={article} />
                            ))
                        ) : (
                            <p style={{ gridColumn: '1 / -1', color: '#6b7280' }}>No articles found for your search.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;