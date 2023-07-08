const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const userController = require('../controllers/users');

const { LINK_REGEXP } = require('../utils/constants');

router.get('', userController.getUsers);

router.get('/me', userController.getUserInfo);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  userController.getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  userController.updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(LINK_REGEXP),
    }),
  }),
  userController.updateUser,
);

module.exports = router;
