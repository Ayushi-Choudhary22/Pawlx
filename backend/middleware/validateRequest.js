const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Runs after express-validator chains; collects any validation errors
 * and forwards them as a single, consistent ApiError.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', formatted);
  }

  next();
};

module.exports = validateRequest;
