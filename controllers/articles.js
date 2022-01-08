const article = require('../models/article');
const CastError = require('../utils/errors/CastError');
const ValidationError = require('../utils/errors/ValidationError');
const NotFoundError = require('../utils/errors/NotFoundError');
const NotAllowedError = require('../utils/errors/NotAllowedError');
const AlreadyUsedError = require('../utils/errors/AlreadyUsedError');
const user = require('../models/user');

const checkErrors = (error, next) => {
  if (error.name === 'ValidationError') {
    next(new ValidationError(error.message));
    return;
  }
  if (error.name === 'CastError') {
    next(new CastError(error.reason));
    return;
  }
  if (error.name === 'MongoServerError' && error.message.includes('link_1 dup key')) {
    next(new AlreadyUsedError('This Article is already saved'));
    return;
  }
  next(error);
};

module.exports.saveArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const { _id: owner } = req.user;

  user
    .findOne({ _id: owner })
    .orFail(() => {
      throw new NotFoundError('Owner does not exist');
    })
    .then(() => {
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
    })
    .catch((error) => checkErrors(error, next));
};

module.exports.checkSavedArticles = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { articles } = req.body;

  const checkedArticles = await Promise.all(
    articles.map(async (item) => {
      const articleItem = item;
      const checkItemPromise = new Promise((resolve, reject) => {
        article
          .findOne({ owner: userId, link: articleItem.url })
          .orFail(() => {
            throw new NotFoundError('Article is not saved');
          })
          .then((savedArticle) => {
            articleItem._id = savedArticle._id;
            resolve(articleItem);
          })
          .catch((error) => {
            if (error instanceof NotFoundError) {
              resolve(articleItem);
            }
            checkErrors(error, next);
            reject(error);
          });
      });
      await checkItemPromise;
      return articleItem;
    })
  );
  res.json({ checkedArticles });
};

module.exports.getSavedArticles = (req, res, next) => {
  const { _id: userId } = req.user;

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
  const { articleId } = req.params;

  article
    .findOne({ _id: articleId })
    .select('+owner')
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
