const PetSitterBooking = require('../models/PetSitterBooking');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const createBooking = async (ownerId, data) => PetSitterBooking.create({ ...data, owner: ownerId });

const getMyBookings = async (ownerId) =>
  PetSitterBooking.find({ owner: ownerId })
    .populate('pet', 'name photo species')
    .populate('sitter', 'name avatar professionalProfile')
    .sort({ startDate: -1 });

const getSitterBookings = async (sitterId, status) => {
  const query = { sitter: sitterId };
  if (status) query.status = status;
  return PetSitterBooking.find(query)
    .populate('pet', 'name photo species')
    .populate('owner', 'name phone')
    .sort({ startDate: 1 });
};

const updateBookingStatus = async (bookingId, sitterId, status) => {
  const booking = await PetSitterBooking.findOneAndUpdate(
    { _id: bookingId, sitter: sitterId },
    { status },
    { new: true }
  );
  if (!booking) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  return booking;
};

const cancelBooking = async (bookingId, ownerId) => {
  const booking = await PetSitterBooking.findOneAndUpdate(
    { _id: bookingId, owner: ownerId },
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  return booking;
};

module.exports = { createBooking, getMyBookings, getSitterBookings, updateBookingStatus, cancelBooking };
