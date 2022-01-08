const router = require('express').Router();
const {
  validateArticleSchema,
  validateHeadersIdParamScehema,
  validateUserSchema,
  validateLoginSchema,
} = require('../utils/joi');
const { getUserMe, createUser, login } = require('../controllers/users');
const {
  getSavedArticles,
  saveArticle,
  deleteArticle,
  checkSavedArticles,
} = require('../controllers/articles');
const auth = require('../middlewares/auth');

router.post('/api/signup', validateUserSchema, createUser);

router.post('/api/signin', validateLoginSchema, login);

router.use(auth);

router.get('/api/articles', getSavedArticles);

router.post('/api/articles/checkSaved', checkSavedArticles);

router.post('/api/articles', validateArticleSchema, saveArticle);

router.delete('/api/articles/:articleId', validateHeadersIdParamScehema, deleteArticle);

router.get('/api/users/me', getUserMe);

module.exports = router;
