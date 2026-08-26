/**
 * Custom error class used across the app so the centralized
 * error handler can respond with a consistent shape.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
