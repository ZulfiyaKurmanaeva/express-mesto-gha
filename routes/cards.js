const cardRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validations');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreateCard, createCard);
cardRoutes.delete('/:cardId', validationCardId, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardId, addLike);
cardRoutes.delete('/:cardId/likes', validationCardId, deleteLike);

module.exports = cardRoutes;
