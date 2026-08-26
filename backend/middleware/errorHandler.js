const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Catches unmatched routes and forwards a 404 ApiError.
 */
const notFound = (req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.originalUrl}`));
};

/**
 * Centralized error handler. Every thrown/forwarded error ends up here
 * and is returned to the client in a consistent JSON shape.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid value for ${err.path}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = 'Validation failed';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
