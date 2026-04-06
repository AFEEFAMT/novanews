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
            const validArticles = res.data.filter(a => a.title !== '[Removed]');
            setArticles(validArticles);
        } catch (err) {
            setError('Failed to fetch the latest intelligence. Please try again later.');
            console.error(err);
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
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search global headlines (e.g., AI, Space, Markets)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>

                <div className="category-filters">
                    <button onClick={() => handleCategoryClick('technology')}>Technology</button>
                    <button onClick={() => handleCategoryClick('business')}>Business</button>
                    <button onClick={() => handleCategoryClick('science')}>Science</button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                {loading ? (
                    <p className="info-msg">Aggregating latest intelligence...</p>
                ) : (
                    <div className="news-grid">
                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <NewsCard key={index} article={article} />
                            ))
                        ) : (
                            <p className="info-msg">No articles found for your search.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;