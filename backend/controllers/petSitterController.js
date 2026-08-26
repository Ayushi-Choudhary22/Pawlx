const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const petSitterService = require('../services/petSitterService');

const createBooking = asyncHandler(async (req, res) => {
  const booking = await petSitterService.createBooking(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, booking, 'Sitter booked successfully').send(res);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await petSitterService.getMyBookings(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, bookings, 'Bookings fetched successfully').send(res);
});

const getSitterQueue = asyncHandler(async (req, res) => {
  const bookings = await petSitterService.getSitterBookings(req.user._id, req.query.status);
  new ApiResponse(HTTP_STATUS.OK, bookings, 'Booking queue fetched successfully').send(res);
});

const updateStatus = asyncHandler(async (req, res) => {
  const booking = await petSitterService.updateBookingStatus(req.params.id, req.user._id, req.body.status);
  new ApiResponse(HTTP_STATUS.OK, booking, 'Booking status updated').send(res);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await petSitterService.cancelBooking(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, booking, 'Booking cancelled').send(res);
});

module.exports = { createBooking, getMyBookings, getSitterQueue, updateStatus, cancelBooking };
