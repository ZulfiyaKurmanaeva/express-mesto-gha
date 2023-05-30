const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const NotFoundError = 404;

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(NotFoundError).send({ message: '404: Ошибка! Данные не найдены!' });
});

module.exports = router;
