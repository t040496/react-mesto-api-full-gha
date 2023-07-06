const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;
const NotFoundError = require('../errors/notFoundError');
const IncorrectDataError = require('../errors/incorrectDataError');
const ConflictError = require('../errors/conflictError');
const User = require('../models/user');
const { NODE_ENV, SECRET_KEY } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/config');
const { CREATE_CODE } = require('../utils/constants');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const findUserById = (req, res, requiredData, next) => {
  User.findById(requiredData)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`В базе данных не найден пользователь с ID: ${requiredData}.`));
      } else if (err instanceof CastError) {
        next(new IncorrectDataError(`Передан некорректный ID пользователя: ${requiredData}.`));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  findUserById(req, res, req.params.userId, next);
};

module.exports.getUserInfo = (req, res, next) => {
  findUserById(req, res, req.user._id, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(CREATE_CODE).send(data);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные для создания пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Указанный email уже зарегистрирован. Пожалуйста используйте другой email'));
      } else {
        next(err);
      }
    });
};

const userUpdate = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`В базе данных не найден пользователь с ID: ${req.user._id}.`));
      } else if (err instanceof CastError) {
        next(new IncorrectDataError(`Передан некорректный ID пользователя: ${req.user._id}.`));
      } else if (err instanceof ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные для редактирования профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  userUpdate(req, res, { name, about }, next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userUpdate(req, res, { avatar }, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === MODE_PRODUCTION ? SECRET_KEY : DEV_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Успешный вход', token });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', 'none', {
    maxAge: 5000,
    httpOnly: true,
    sameSite: true,
  });
  res.send({ message: 'Успешный выход' });
};
