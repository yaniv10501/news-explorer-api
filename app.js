require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const ServerError = require('./utils/errors/ServerError');
const ResourceNotFound = require('./utils/errors/ResourceNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');
const { createUser, login } = require('./controllers/users');

const app = express();

const {
  PORT = 3000,
  MONGO_DB_SERVER = 'mongodb://localhost:27017',
  NODE_ENV = 'development',
} = process.env;

mongoose.connect(`${MONGO_DB_SERVER}/finalproject`);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.post('/signup', createUser);
app.post('./signin', login);

app.use('/', userRoutes);
app.use('/', articleRoutes);

app.use(errorLogger);

app.use((req, res, next) => new ResourceNotFound(req, res, next));

app.use(ServerError);

app.listen(PORT, () => {
  logger.log(`Express Server started on Port ${PORT} | Environment : ${NODE_ENV}`);
});
