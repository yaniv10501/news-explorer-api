const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const CastError = require('../utils/errors/CastError');
const ValidationError = require('../utils/errors/ValidationError');
const AlreadyUsedError = require('../utils/errors/AlreadyUsedError');
const AuthorizationError = require('../utils/errors/AuthorizationError');

const checkErrors = (error, next) => {
  if (error.name === 'ValidationError') {
    next(new ValidationError(error.message));
    return;
  }
  if (error.name === 'CastError') {
    next(new CastError(error.reason));
    return;
  }
  if (error.name === 'MongoServerError' && error.message.includes('email_1 dup key')) {
    next(new AlreadyUsedError('This Email is already used'));
    return;
  }
  next(error);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      })
        .then((newUser) =>
          res.status(201).json({
            message: 'A new user has been created',
            user: {
              name: newUser.name,
              email: newUser.email,
            },
          })
        )
        .catch((error) => checkErrors(error, next))
    )
    .catch((error) => checkErrors(error, next));
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user?._id })
    .orFail(() => {
      throw new NotFoundError('User ID not found');
    })
    .then((user) => res.send(user))
    .catch((error) => checkErrors(error, next));
};

module.exports.login = (req, res, next) => {
  const { JWT_SECRET = 'Secret-key' } = process.env;
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new AuthorizationError('Incorrect email or password');
    })
    .select('+password')
    .then((user) =>
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            return res.send({ token });
          }
          throw new AuthorizationError('Incorrect email or password');
        })
        .catch((error) => checkErrors(error, next))
    )
    .catch((error) => checkErrors(error, next));
};
