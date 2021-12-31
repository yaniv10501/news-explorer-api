const router = require('express').Router();
const { validateUserSchema, validateHeadersIdParamScehema } = require('../utils/joi');
const { getSavedArticles, saveArticle, deleteArticle } = require('../controllers/articles');

router.get('/articles', getSavedArticles);

router.post('/articles', validateUserSchema, saveArticle);

router.delete('/articles/:articleId', validateHeadersIdParamScehema, deleteArticle);

module.exports = router;
