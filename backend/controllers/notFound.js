const NotFoundError = require('../errors/notFoundError');

module.exports.notFound = (req, res, next) => {
  next(new NotFoundError('Указан несуществующий URL'));
};
