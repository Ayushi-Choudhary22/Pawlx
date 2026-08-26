const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const userService = require('../services/userService');

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.OK, updatedUser, 'Profile updated successfully').send(res);
});

// @desc    Upload / replace profile picture
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No image file provided');
  }
  const updatedUser = await userService.updateAvatar(req.user._id, req.file.buffer);
  new ApiResponse(HTTP_STATUS.OK, updatedUser, 'Profile picture updated').send(res);
});

// @desc    List professionals (vets / sitters / groomers) with filters
// @route   GET /api/users/professionals/:role
// @access  Public
const listProfessionals = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const professionals = await userService.listProfessionals(role, req.query);
  new ApiResponse(HTTP_STATUS.OK, professionals, 'Professionals fetched successfully').send(res);
});

// @desc    Get a single professional's full public profile
// @route   GET /api/users/professional/:id
// @access  Public
const getProfessionalById = asyncHandler(async (req, res) => {
  const professional = await userService.getProfessionalById(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, professional, 'Professional fetched successfully').send(res);
});

module.exports = { updateProfile, uploadAvatar, listProfessionals, getProfessionalById };
