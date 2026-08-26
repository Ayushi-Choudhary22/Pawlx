const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { uploadToCloudinary, deleteFromCloudinary } = require('../helpers/uploadToCloudinary');

const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'phone', 'address', 'professionalProfile', 'aadharNumber'];
  const sanitized = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) sanitized[field] = updates[field];
  });

  if (updates.aadharNumber !== undefined) {
    const trimmed = updates.aadharNumber.trim();
    sanitized.aadharNumber = trimmed;
    sanitized.isVerified = trimmed.length > 0;
  }

  const user = await User.findByIdAndUpdate(userId, sanitized, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  return user.toSafeObject();
};

const updateAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const { url, publicId } = await uploadToCloudinary(fileBuffer, 'pawlx/avatars');
  user.avatar = { url, publicId };
  await user.save();

  return user.toSafeObject();
};

const listProfessionals = async (role, filters = {}) => {
  const query = { role, isActive: true, 'professionalProfile.isApproved': true };

  if (filters.city) query['professionalProfile.city'] = new RegExp(filters.city, 'i');
  if (filters.minRating) query['professionalProfile.rating'] = { $gte: Number(filters.minRating) };

  return User.find(query).select('-password').sort({ 'professionalProfile.rating': -1 });
};

const getProfessionalById = async (id) => {
  const professional = await User.findOne({
    _id: id,
    isActive: true,
    'professionalProfile.isApproved': true,
  }).select('-password');

  if (!professional) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Professional not found');
  return professional;
};

module.exports = { updateProfile, updateAvatar, listProfessionals, getProfessionalById };
