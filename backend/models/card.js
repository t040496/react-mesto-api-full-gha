const mongoose = require('mongoose');

const { LINK_REGEXP } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Введите имя карточки'],
    minlength: [2, 'Текст должен быть не короче 2 символов'],
    maxlength: [30, 'Текст должен быть короче 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Введите ссылку на картинку'],
    validate: {
      validator: (v) => LINK_REGEXP.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
