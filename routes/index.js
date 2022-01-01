const router = require('express').Router();
const {
  validateArticleSchema,
  validateHeadersIdParamScehema,
  validateUserSchema,
  validateLoginSchema,
} = require('../utils/joi');
const { getAllUsers, getUserMe, createUser, login } = require('../controllers/users');
const { getSavedArticles, saveArticle, deleteArticle } = require('../controllers/articles');
const auth = require('../middlewares/auth');

router.post('/signup', validateUserSchema, createUser);

router.post('/signin', validateLoginSchema, login);

router.use(auth);

router.get('/articles', getSavedArticles);

router.post('/articles', validateArticleSchema, saveArticle);

router.delete('/articles/:articleId', validateHeadersIdParamScehema, deleteArticle);

router.get('/users/all', getAllUsers);

router.get('/users/me', getUserMe);

module.exports = router;
