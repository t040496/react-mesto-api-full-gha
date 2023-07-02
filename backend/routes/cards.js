const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const cardController = require('../controllers/cards');
const { LINK_REGEXP } = require('../utils/constants');

router.get('', cardController.getCards);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  cardController.deleteCardById,
);

router.post(
  '',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(LINK_REGEXP),
    }),
  }),
  cardController.createCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  cardController.likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  cardController.dislikeCard,
);

module.exports = router;
