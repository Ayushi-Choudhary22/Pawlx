const GroomingBooking = require('../models/GroomingBooking');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const createBooking = async (ownerId, data) => GroomingBooking.create({ ...data, owner: ownerId });

const getMyBookings = async (ownerId) =>
  GroomingBooking.find({ owner: ownerId })
    .populate('pet', 'name photo species')
    .populate('groomer', 'name avatar professionalProfile')
    .sort({ date: -1 });

const getGroomerBookings = async (groomerId, status) => {
  const query = { groomer: groomerId };
  if (status) query.status = status;
  return GroomingBooking.find(query)
    .populate('pet', 'name photo species')
    .populate('owner', 'name phone')
    .sort({ date: 1 });
};

const updateBookingStatus = async (bookingId, groomerId, status) => {
  const booking = await GroomingBooking.findOneAndUpdate(
    { _id: bookingId, groomer: groomerId },
    { status },
    { new: true }
  );
  if (!booking) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  return booking;
};

const cancelBooking = async (bookingId, ownerId) => {
  const booking = await GroomingBooking.findOneAndUpdate(
    { _id: bookingId, owner: ownerId },
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  return booking;
};

module.exports = { createBooking, getMyBookings, getGroomerBookings, updateBookingStatus, cancelBooking };
