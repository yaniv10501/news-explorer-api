require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const ServerError = require('./utils/errors/ServerError');
const ResourceNotFound = require('./utils/errors/ResourceNotFound');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const app = express();

const {
  PORT = 3000,
  MONGO_DB_SERVER = 'mongodb://localhost:27017',
  NODE_ENV = 'development',
  COOKIE_SECRET = 'cookie-secret',
} = process.env;

mongoose.connect(`${MONGO_DB_SERVER}/finalproject`);

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(helmet());
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(cors());
app.options('*', cors());

app.use(requestLogger);
app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use((req, res, next) => new ResourceNotFound(req, res, next));

app.use(ServerError);

app.listen(PORT, () => {
  logger.log(`Express Server started on Port ${PORT} | Environment : ${NODE_ENV}`);
});
