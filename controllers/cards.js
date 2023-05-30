const Card = require('../models/card');

const BadRequestError = 400;
const NotFoundError = 404;
const InternalServerError = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(InternalServerError).send({ message: 'Что-то пошло не так...' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }

      return res.status(InternalServerError).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }

      return res.status(InternalServerError).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFoundError).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }

      return res.status(InternalServerError).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFoundError).send({
          message: 'Передан несуществующий _id карточки.',
        });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({
          message: 'Переданы некорректные данные для снятиия лайка.',
        });
      }

      return res.status(InternalServerError).send({ message: 'Что-то пошло не так...' });
    });
};
