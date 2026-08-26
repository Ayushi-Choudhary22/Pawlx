const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const groomingService = require('../services/groomingService');

const createBooking = asyncHandler(async (req, res) => {
  const booking = await groomingService.createBooking(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, booking, 'Grooming appointment booked').send(res);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await groomingService.getMyBookings(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, bookings, 'Bookings fetched successfully').send(res);
});

const getGroomerQueue = asyncHandler(async (req, res) => {
  const bookings = await groomingService.getGroomerBookings(req.user._id, req.query.status);
  new ApiResponse(HTTP_STATUS.OK, bookings, 'Booking queue fetched successfully').send(res);
});

const updateStatus = asyncHandler(async (req, res) => {
  const booking = await groomingService.updateBookingStatus(req.params.id, req.user._id, req.body.status);
  new ApiResponse(HTTP_STATUS.OK, booking, 'Booking status updated').send(res);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await groomingService.cancelBooking(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, booking, 'Booking cancelled').send(res);
});

module.exports = { createBooking, getMyBookings, getGroomerQueue, updateStatus, cancelBooking };
