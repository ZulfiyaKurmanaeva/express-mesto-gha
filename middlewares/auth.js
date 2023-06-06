const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError('Пройдите авторизацию!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'JWT-secret');
  } catch (err) {
    return next(new NotAuthError('Пройдите авторизацию!'));
  }
  req.user = payload;
  return next();
};
