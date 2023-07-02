const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const bcrypt = require('bcryptjs');

const { LINK_REGEXP } = require('../utils/constants');
const AuthorizationError = require('../errors/authorizationError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Текст должен быть не короче 2 символов'],
      maxlength: [30, 'Текст должен быть короче 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле email должно быть заполнено'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле password должно быть заполнено'],
      select: false,
    },
    about: {
      type: String,
      minlength: [2, 'Текст должен быть не короче 2 символов'],
      maxlength: [30, 'Текст должен быть короче 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => LINK_REGEXP.test(v),
        message: 'Неправильный формат ссылки',
      },
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              throw new AuthorizationError('Неправильная почта или пароль');
            }
            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                throw new AuthorizationError('Неправильная почта или пароль');
              }
              return user;
            });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
