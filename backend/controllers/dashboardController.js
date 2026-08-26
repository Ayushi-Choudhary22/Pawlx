const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const dashboardService = require('../services/dashboardService');

const getOwnerDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getOwnerDashboard(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, data, 'Dashboard data fetched successfully').send(res);
});

module.exports = { getOwnerDashboard };
