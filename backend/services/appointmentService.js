const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const bookAppointment = async (ownerId, data) => {
  return Appointment.create({ ...data, owner: ownerId, status: 'pending' });
};

const getMyAppointments = async (ownerId, status) => {
  const query = { owner: ownerId };
  if (status) query.status = status;
  return Appointment.find(query)
    .populate('pet', 'name photo species')
    .populate('veterinarian', 'name avatar professionalProfile')
    .sort({ date: -1 });
};

const getVetAppointments = async (vetId, status) => {
  const query = { veterinarian: vetId };
  if (status) query.status = status;
  return Appointment.find(query)
    .populate('pet', 'name photo species')
    .populate('owner', 'name phone')
    .sort({ date: 1 });
};

const updateAppointmentStatus = async (appointmentId, vetId, status, extra = {}) => {
  const appointment = await Appointment.findOne({ _id: appointmentId, veterinarian: vetId });
  if (!appointment) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');

  appointment.status = status;
  if (extra.vetNotes) appointment.vetNotes = extra.vetNotes;
  if (extra.cancelReason) appointment.cancelReason = extra.cancelReason;
  if (extra.meetingLink !== undefined) appointment.meetingLink = extra.meetingLink;
  await appointment.save();

  return appointment;
};

const cancelAppointment = async (appointmentId, ownerId, cancelReason) => {
  const appointment = await Appointment.findOne({ _id: appointmentId, owner: ownerId });
  if (!appointment) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');

  appointment.status = 'cancelled';
  appointment.cancelReason = cancelReason;
  await appointment.save();

  return appointment;
};

const rescheduleAppointment = async (appointmentId, ownerId, date, timeSlot) => {
  const appointment = await Appointment.findOne({ _id: appointmentId, owner: ownerId });
  if (!appointment) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');

  appointment.date = date;
  appointment.timeSlot = timeSlot;
  appointment.status = 'pending';
  await appointment.save();

  return appointment;
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getVetAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
};
