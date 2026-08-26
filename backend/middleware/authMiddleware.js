const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const User = require('../models/User');

/**
 * Verifies the JWT sent in the Authorization header and attaches
 * the authenticated user (without password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists or is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized, token invalid or expired');
  }
});

/**
 * Restricts access to the given roles. Use after `protect`.
 * @param  {...string} roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action');
    }
    next();
  };
};

module.exports = { protect, authorize };
