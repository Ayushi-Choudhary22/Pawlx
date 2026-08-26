const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const { Adoption, AdoptionApplication } = require('../models/Adoption');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const ROLES = require('../constants/roles');

/**
 * High-level platform analytics for the admin dashboard landing view.
 */
const getAnalytics = async () => {
  const [totalUsers, totalProducts, totalOrders, revenueAgg, pendingProfessionals, activeAdoptions] =
    await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      User.countDocuments({
        role: { $in: [ROLES.VETERINARIAN, ROLES.PET_SITTER, ROLES.GROOMER] },
        'professionalProfile.isApproved': false,
      }),
      Adoption.countDocuments({ status: 'available' }),
    ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
    pendingProfessionals,
    activeAdoptions,
  };
};

const listUsers = async (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.search) query.$or = [
    { name: new RegExp(filters.search, 'i') },
    { email: new RegExp(filters.search, 'i') },
  ];

  return User.find(query).select('-password').sort({ createdAt: -1 }).limit(100);
};

const toggleUserActive = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  return user;
};

const approveProfessional = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { 'professionalProfile.isApproved': true },
    { new: true }
  ).select('-password');
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  return user;
};

const listAllOrders = async () => Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(100);

const listPendingAdoptionApplications = async () =>
  AdoptionApplication.find({ status: 'pending' })
    .populate('adoption', 'name species')
    .populate('applicant', 'name email')
    .sort({ createdAt: -1 });

module.exports = {
  getAnalytics,
  listUsers,
  toggleUserActive,
  approveProfessional,
  listAllOrders,
  listPendingAdoptionApplications,
};
