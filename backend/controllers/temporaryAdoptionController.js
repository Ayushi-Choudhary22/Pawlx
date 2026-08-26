const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const temporaryAdoptionService = require('../services/temporaryAdoptionService');

const createListing = asyncHandler(async (req, res) => {
  const listing = await temporaryAdoptionService.createListing(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, listing, 'Temporary adoption listing created successfully').send(res);
});

const listListings = asyncHandler(async (req, res) => {
  const listings = await temporaryAdoptionService.listListings(req.user._id, req.query);
  new ApiResponse(HTTP_STATUS.OK, listings, 'Listings fetched successfully').send(res);
});

const sendConnectionRequest = asyncHandler(async (req, res) => {
  const request = await temporaryAdoptionService.sendConnectionRequest(req.user._id, req.params.id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, request, 'Connection request sent successfully').send(res);
});

const getMyDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await temporaryAdoptionService.getMyDashboard(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, dashboardData, 'Dashboard data fetched successfully').send(res);
});

const respondToRequest = asyncHandler(async (req, res) => {
  const request = await temporaryAdoptionService.respondToRequest(req.user._id, req.params.requestId, req.body.status);
  new ApiResponse(HTTP_STATUS.OK, request, 'Connection request response processed').send(res);
});

module.exports = {
  createListing,
  listListings,
  sendConnectionRequest,
  getMyDashboard,
  respondToRequest,
};
