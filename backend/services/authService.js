const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { generateAuthToken, generateResetToken } = require('../utils/generateToken');
const { sendEmail } = require('../config/mailer');

/**
 * Registers a new user and returns the user + auth token.
 */
const registerUser = async ({ name, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role, phone });
  const token = generateAuthToken(user._id, user.role);

  return { user: user.toSafeObject(), token };
};

/**
 * Authenticates a user by email/password and returns user + auth token.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'This account has been deactivated');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateAuthToken(user._id, user.role);
  return { user: user.toSafeObject(), token };
};

/**
 * Sends a password reset email containing a signed, short-lived token.
 */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  // Do not reveal whether the email exists — respond the same way either way
  if (!user) return;

  const resetToken = generateResetToken(user._id);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your PAWLX password',
    html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password. This link expires in 15 minutes.</p><p><a href="${resetUrl}">Reset Password</a></p>`,
  });
};

/**
 * Verifies the reset token and updates the user's password.
 */
const resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Reset link is invalid or has expired');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  user.password = newPassword;
  await user.save();
};

/**
 * Changes the password for an already-authenticated user.
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
};
