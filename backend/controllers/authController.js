const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const authService = require('../services/authService');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const result = await authService.registerUser({ name, email, password, role, phone });
  new ApiResponse(HTTP_STATUS.CREATED, result, 'Account created successfully').send(res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  new ApiResponse(HTTP_STATUS.OK, result, 'Logged in successfully').send(res);
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(HTTP_STATUS.OK, req.user.toSafeObject(), 'Current user fetched').send(res);
});

// @desc    Logout (client discards token; endpoint kept for consistency / future blacklist)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  new ApiResponse(HTTP_STATUS.OK, null, 'Logged out successfully').send(res);
});

// @desc    Request a password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  new ApiResponse(
    HTTP_STATUS.OK,
    null,
    'If an account exists with this email, a reset link has been sent'
  ).send(res);
});

// @desc    Reset password using a valid token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  new ApiResponse(HTTP_STATUS.OK, null, 'Password reset successfully').send(res);
});

// @desc    Change password while logged in
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  new ApiResponse(HTTP_STATUS.OK, null, 'Password changed successfully').send(res);
});

module.exports = { register, login, getMe, logout, forgotPassword, resetPassword, changePassword };
