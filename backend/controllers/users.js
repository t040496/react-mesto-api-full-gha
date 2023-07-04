const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-error');
const IncorrectDataError = require('../errors/incorrectDataError');
const userModel = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

const { CREATE_CODE, SECRET_KEY } = require('../utils/constants');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const findUserById = (req, res, requiredData, next) => {
  userModel
    .findById(requiredData)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует')) ;
    .then((user) => res.send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const requiredData = req.params.userId;
  findUserById(req, res, requiredData, next);
};

const getUserInfo = (req, res, next) => {
  const requiredData = req.user._id;
  findUserById(req, res, requiredData, next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => userModel.create({
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
      if (err.name === 'ValidationError'){
        next(new IncorrectDataError('Некорректные данные для создания пользователя'));
      } else  if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });

      res.send({ message: 'Успешный вход', token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  userModel
    .findOneAndUpdate(
      { _id: req.user._id },
      { ...req.body },
      {
        runValidators: true,
        new: true,
      },
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError'){
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  loginUser,
  getUserInfo,
};
