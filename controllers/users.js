const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .then((users) => res.send(users))
        .catch(next);
};

module.exports.getUserById = (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Пользователь по указанному _id не найден');
            }
            res.send({ data: user });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
            }
            return next(err);
        });
};

module.exports.getUser = (req, res, next) => {
    userSchema
        .findById(req.user._id)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Пользователь не найден');
            }
            res.status(200)
                .send(user);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(BadRequestError('Переданы некорректные данные'));
            } else {
                next(err);
            }
        });
};

module.exports.createUser = (req, res, next) => {
    const { name, about, avatar } = req.body;

    User.create({
        name,
        about,
        avatar
    })
        .then(() => res.status(201)
            .send(
                {
                    data: {
                        name,
                        about,
                        avatar
                    },
                },
            ))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
            }
            return next(err);
        });
}


module.exports.updateUser = (req, res, next) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(
        req.user._id,
        {
            name,
            about,
        },
        {
            new: true,
            runValidators: true,
        },
    )
        .orFail(() => {
            throw new NotFoundError('Пользователь с указанным _id не найден');
        })
        .then((user) => res.status(200)
            .send(user))
        .catch((err) => {
            if (err.name === 'CastError' || err.name === 'ValidationError') {
                return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
            }
            return next(err);
        });
};

module.exports.updateAvatar = (req, res, next) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        {
            new: true,
            runValidators: true,
        },
    )
        .orFail(() => {
            throw new NotFoundError('Аватар пользователя по указанному _id не найден');
        })
        .then((user) => res.status(200)
            .send(user))
        .catch((err) => {
            if (err.name === 'CastError' || err.name === 'ValidationError') {
                return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
            }
            return next(err);
        });
};