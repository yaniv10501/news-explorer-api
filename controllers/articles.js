const article = require('../models/article');
const CastError = require('../utils/errors/CastError');
const ValidationError = require('../utils/errors/ValidationError');
const NotFoundError = require('../utils/errors/NotFoundError');
const NotAllowedError = require('../utils/errors/NotAllowedError');

const checkErrors = (error, next) => {
  if (error.name === 'ValidationError') {
    next(new ValidationError(error.message));
    return;
  }
  if (error.name === 'CastError') {
    next(new CastError(error.reason));
    return;
  }
  next(error);
};

module.exports.saveArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image, owner } = req.body;

  article
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner,
    })
    .then((savedArticle) => {
      res.status(201).json({
        message: `Article ${title} saved successfully`,
        article: {
          title,
          id: savedArticle._id,
        },
      });
    })
    .catch((error) => checkErrors(error, next));
};

module.exports.getSavedArticles = (req, res, next) => {
  const { userId } = req.params;

  article
    .find({ owner: userId })
    .orFail(() => {
      throw new NotFoundError('No saved articles found');
    })
    .then((articles) => {
      res.status(201).json(articles);
    })
    .catch((error) => checkErrors(error, next));
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params._id;

  article
    .findOne({ _id: articleId })
    .orFail(() => {
      throw new NotFoundError('Article not found');
    })
    .then((articleToDelete) => {
      if (articleToDelete.owner.toString() !== req.user?._id) {
        throw new NotAllowedError('You are not allowed to delete this article');
      }
      article
        .deleteOne({ _id: articleId })
        .then(() => res.json({ message: `article - ${articleId} has been deleted` }))
        .catch((error) => checkErrors(error, next));
    })
    .catch((error) => checkErrors(error, next));
};
