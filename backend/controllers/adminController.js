const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const adminService = require('../services/adminService');

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();
  new ApiResponse(HTTP_STATUS.OK, analytics, 'Analytics fetched successfully').send(res);
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers(req.query);
  new ApiResponse(HTTP_STATUS.OK, users, 'Users fetched successfully').send(res);
});

const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserActive(req.params.id, req.body.isActive);
  new ApiResponse(HTTP_STATUS.OK, user, 'User status updated').send(res);
});

const approveProfessional = asyncHandler(async (req, res) => {
  const user = await adminService.approveProfessional(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, user, 'Professional approved').send(res);
});

const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await adminService.listAllOrders();
  new ApiResponse(HTTP_STATUS.OK, orders, 'Orders fetched successfully').send(res);
});

const listPendingAdoptionApplications = asyncHandler(async (req, res) => {
  const applications = await adminService.listPendingAdoptionApplications();
  new ApiResponse(HTTP_STATUS.OK, applications, 'Pending applications fetched').send(res);
});

module.exports = {
  getAnalytics,
  listUsers,
  toggleUserActive,
  approveProfessional,
  listAllOrders,
  listPendingAdoptionApplications,
};
