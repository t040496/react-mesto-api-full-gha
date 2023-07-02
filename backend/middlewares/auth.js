const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const AuthorizationError = require('../errors/authorizationError');

module.exports = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  if (!token) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
