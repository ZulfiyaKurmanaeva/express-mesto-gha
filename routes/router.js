const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
//
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const auth = require('../middlewares/auth');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

const NotFoundError = require('../errors/NotFoundError');

router.use('/*', (req, res, next) => {
  next(new NotFoundError('404: Ошибка! Данные не найдены!'));
});

module.exports = router;
