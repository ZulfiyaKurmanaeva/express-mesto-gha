/* eslint-disable no-console */

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

const router = require('./routes/router');

const handleError = require('./middlewares/handelError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(router);
app.use(errors());
app.use(helmet());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
