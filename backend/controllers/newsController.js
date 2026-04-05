const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/genai');

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.getNews = async (req, res) => {
    try {
        const { category, query } = req.query;
        let url = '';

        if (query) {
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&apiKey=${process.env.NEWS_API_KEY}`;
        } else {
            const safeCategory = category || 'technology';
            url = `https://newsapi.org/v2/top-headlines?category=${safeCategory}&language=en&apiKey=${process.env.NEWS_API_KEY}`;
        }

        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (error) {
        console.error('NewsAPI Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch news from provider' });
    }
};

exports.summarizeArticle = async (req, res) => {
    try {
        const { articleText } = req.body;
        if (!articleText) {
            return res.status(400).json({ error: 'Article text is required for summarization' });
        }

        const prompt = `Provide a concise, 2-sentence summary of the following news article: ${articleText}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        res.json({ summary: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ error: 'AI generation failed' });
    }
};

exports.saveArticle = async (req, res) => {
    try {
        const { title, url, summary } = req.body;
        
        if (!title || !url) {
            return res.status(400).json({ error: 'Title and URL are required to save an article' });
        }

        const savedArticle = await prisma.savedArticle.create({
            data: {
                title,
                url,
                summary,
                userId: req.user.userId
            }
        });
        
        res.status(201).json(savedArticle);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: 'Failed to save article to database' });
    }
};

exports.getSavedArticles = async (req, res) => {
    try {
        const savedArticles = await prisma.savedArticle.findMany({
            where: { userId: req.user.userId },
            orderBy: { id: 'desc' } // Shows newest saved articles first
        });
        res.json(savedArticles);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve saved articles' });
    }
};

exports.deleteSavedArticle = async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);

        const article = await prisma.savedArticle.findUnique({
            where: { id: articleId }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        if (article.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this article' });
        }

        await prisma.savedArticle.delete({
            where: { id: articleId }
        });

        res.json({ message: 'Article removed from library' });
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: 'Failed to delete article' });
    }
};