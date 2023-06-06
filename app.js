/* eslint-disable no-console */

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes/router');

const { createUser, login } = require('./controllers/users');
const { validationCreateUser, validationLogin } = require('./middlewares/validations');
const handleError = require('./middlewares/handelError');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use(express.json());

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

const auth = require('./middlewares/auth');

app.use(auth);
app.use(router);
app.use(errors());
app.use(helmet());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
