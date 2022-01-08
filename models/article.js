const mongoose = require('mongoose');
const { testUrl } = require('../utils/regex');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return testUrl(value);
      },
      message: 'Please fill in a valid URL',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return testUrl(value);
      },
      message: 'Please fill in a valid URL',
    },
  },
  owner: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
