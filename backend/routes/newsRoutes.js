const express = require('express');
const router = express.Router();
const { getNews, summarizeArticle, saveArticle, getSavedArticles, deleteSavedArticle } = require('../controllers/newsController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', getNews);
router.post('/summarize', summarizeArticle);
router.post('/save', authenticateToken, saveArticle);
router.get('/saved', authenticateToken, getSavedArticles); 
router.delete('/saved/:id', authenticateToken, deleteSavedArticle);

module.exports = router;