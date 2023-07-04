const { BAD_REQUEST_ERROR_CODE } = require('../utils/constants');


class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_CODE;
  }
}

module.exports = IncorrectDataError;