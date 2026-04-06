import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/NewsCard.css';

const Library = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://novanews-jbjh.onrender.com/api/news/saved', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedArticles(res.data);
            } catch (err) {
                setError('Failed to load your personal library.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://novanews-jbjh.onrender.com/api/news/saved/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSavedArticles(savedArticles.filter(article => article.id !== id));
        } catch (err) {
            alert('Failed to delete the article.');
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 className="page-title">My Personal Intelligence Library</h2>
                
                {error && <p className="error-msg">{error}</p>}

                {loading ? (
                    <p className="info-msg">Loading your saved articles...</p>
                ) : (
                    <div className="news-grid">
                        {savedArticles.map((article, index) => (
                            <div key={index} className="news-card">
                                <h3>{article.title}</h3>
                                <a href={article.url} target="_blank" rel="noreferrer" className="read-link">Read Full Source</a>
                                
                                <div className="summary-section">
                                    <p className="ai-summary">
                                        <strong>Saved AI Overview:</strong> {article.summary || "No summary was generated before saving."}
                                    </p>
                                </div>

                                <button 
                                    onClick={() => handleDelete(article.id)}
                                    className="btn-delete"
                                >
                                    Remove from Library
                                </button>
                            </div>
                        ))}
                        
                        {savedArticles.length === 0 && (
                            <p className="info-msg">
                                You haven't saved any articles yet. Head back to the dashboard to find some!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;