const User = require('../models/user');

const BadRequestError = 400;
const NotFoundError = 404;
const ForbiddenError = 500;

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch(() => res.status(ForbiddenError).send({ message: 'Что-то пошло не так...' }));
};

module.exports.getUserById = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => {
            if (err.name === 'CastError') {
                return res
                    .status(BadRequestError)
                    .send({ message: 'Пользователь по указанному _id не найден.' });
            }

            if (err.name === 'DocumentNotFoundError') {
                return res
                    .status(NotFoundError)
                    .send({ message: 'Пользователь по указанному _id не найден.' });
            }

            return res.status(ForbiddenError).send({ message: 'Что-то пошло не так...' });
        });
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(BadRequestError).send({
                    message: 'Переданы некорректные данные при создании пользователя.',
                });
            }

            return res.status(ForbiddenError).send({ message: 'Что-то пошло не так...' });
        });
};

module.exports.updateUser = (req, res) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true },
    )
        .orFail()
        .then((user) => res.send(user))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(BadRequestError).send({
                    message: 'Переданы некорректные данные при обновлении профиля.',
                });
            }

            if (err.name === 'DocumentNotFoundError') {
                return res.status(NotFoundError).send({
                    message: 'Пользователь с указанным _id не найден.',
                });
            }

            return res.status(ForbiddenError).send({ message: 'Что-то пошло не так...' });
        });
};

module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true },
    )
        .orFail()
        .then((user) => res.status(200).send(user))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(BadRequestError).send({
                    message: 'Переданы некорректные данные при обновлении аватара.',
                });
            }

            if (err.name === 'DocumentNotFoundError') {
                return res.status(NotFoundError).send({
                    message: 'Пользователь с указанным _id не найден.',
                });
            }

            return res.status(ForbiddenError).send({ message: 'Что-то пошло не так...' });
        });
};