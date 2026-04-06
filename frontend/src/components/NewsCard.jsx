import { useState } from 'react';
import axios from 'axios';
import '../styles/NewsCard.css';

const NewsCard = ({ article }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/news/summarize', {
                articleText: article.description || article.title
            });
            setSummary(res.data.summary);
        } catch (error) {
            alert('Failed to generate summary');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authentication error: No token found. Please log in again.");
                return;
            }
            await axios.post('https://novanews-jbjh.onrender.com/api/news/save', {
                title: article.title,
                url: article.url,
                summary: summary || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Article saved to library');
        } catch (error) {
            console.error("FULL SAVE ERROR:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || 'Unknown server error';
            alert('Failed to save article');
        }
    };

    return (
        <div className="news-card">
            <h3>{article.title}</h3>
            <a href={article.url} target="_blank" rel="noreferrer" className="read-link">Read Full Source</a>
            
            <div className="summary-section">
                {summary ? (
                    <p className="ai-summary"><strong>AI Overview:</strong> {summary}</p>
                ) : (
                    <button className="btn-summarize" onClick={handleSummarize} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Generate AI Summary'}
                    </button>
                )}
            </div>

            <button className="btn-save" onClick={handleSave}>Save to Profile</button>
        </div>
    );
};

export default NewsCard;