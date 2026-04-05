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
                const res = await axios.get('http://localhost:5000/api/news/saved', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedArticles(res.data);
            } catch (err) {
                setError('Failed to load your personal library.');
                console.error("Failed to load library", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/news/saved/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSavedArticles(savedArticles.filter(article => article.id !== id));
        } catch (err) {
            alert('Failed to delete the article.');
            console.error("Delete error", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 style={{ marginBottom: '20px', color: '#111827' }}>My Personal Intelligence Library</h2>
                
                {error && <p style={{ color: '#dc2626' }}>{error}</p>}

                {loading ? (
                    <p style={{ color: '#4b5563' }}>Loading your saved articles...</p>
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

                                {/* NEW: The Delete Button */}
                                <button 
                                    onClick={() => handleDelete(article.id)}
                                    style={{ marginTop: '10px', background: '#dc2626', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Remove from Library
                                </button>
                            </div>
                        ))}
                        
                        {savedArticles.length === 0 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
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