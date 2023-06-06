const isURL = require('validator/lib/isURL');
const { celebrate, Joi } = require('celebrate');

const BadRequestError = require('../errors/BadRequestError');

const validationUrl = (url) => {
  if (isURL(url)) {
    return url;
  }
  throw new BadRequestError('Введите корректный адрес ссылки');
};

const validationId = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  if (regex.test(id)) return id;
  throw new BadRequestError('Передан некорректный ID');
};

const validationCreateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      avatar: Joi.string().custom(validationUrl),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{6,20}$/).required(),
    }),
});

const validationLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{6,20}$/).required(),
    }),
});

const validationUserId = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string().required().custom(validationId),
    }),
});

const validationUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().required().custom(validationUrl),
    }),
});

const validationCreateCard = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().custom(validationUrl),
    }),
});

const validationCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string().required().custom(validationId),
    }),
});

module.exports = {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
  validationCreateUser,
  validationLogin,
  validationCreateCard,
  validationCardId,
};
