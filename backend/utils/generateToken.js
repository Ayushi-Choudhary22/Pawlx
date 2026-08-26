const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for an authenticated session.
 * @param {string} userId
 * @param {string} role
 */
const generateAuthToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Generates a short-lived token used for password reset / email verification links.
 * @param {string} userId
 */
const generateResetToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_RESET_SECRET, {
    expiresIn: process.env.JWT_RESET_EXPIRES_IN || '15m',
  });
};

module.exports = { generateAuthToken, generateResetToken };
