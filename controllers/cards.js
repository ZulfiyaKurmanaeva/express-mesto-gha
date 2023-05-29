const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
    Card.find({})
        .then((cards) => res.send(cards))
        .catch(next);
};

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;

    Card.create({ name, link, owner: req.user._id })
        .then((card) => res.status(201).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при создании карточки'));
            } else {
                next(err);
            }
        });
};

module.exports.deleteCard = (req, res, next) => {
    const { cardId } = req.params;

    Card.findById(cardId)
        .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
        .then((card) => {
            if (card.owner.toString() !== req.user._id) {
                return next(new ForbiddenError('Отказано в доступе! Данная карточка не принадлежит пользователю!'));
            }
            return Card.deleteOne(card)
                .then(() => res.status(200)
                    .send({ message: 'Карточка успешно удаленна!' }));
        })
        .catch(next);
};

module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
        .then((card) => {
            if (!card) {
                return next(new NotFoundError('Карточка с указанным _id не найдена.'));
            }

            return res.status(200)
                .send(card);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
            }

            return next(err);
        });
};

module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
        .then((card) => {
            if (!card) {
                return next(new NotFoundError('Карточка с указанным _id не найдена.'));
            }

            return res.status(200)
                .send(card);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
            }

            return next(err);
        });
};