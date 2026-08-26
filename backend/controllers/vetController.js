const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const appointmentService = require('../services/appointmentService');

// @desc    Book a vet appointment
// @route   POST /api/vets/appointments
// @access  Private (pet_owner)
const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, appointment, 'Appointment requested successfully').send(res);
});

// @desc    Get logged-in owner's appointments
// @route   GET /api/vets/appointments/my
// @access  Private (pet_owner)
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getMyAppointments(req.user._id, req.query.status);
  new ApiResponse(HTTP_STATUS.OK, appointments, 'Appointments fetched successfully').send(res);
});

// @desc    Get logged-in vet's appointment queue
// @route   GET /api/vets/appointments/queue
// @access  Private (veterinarian)
const getVetQueue = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getVetAppointments(req.user._id, req.query.status);
  new ApiResponse(HTTP_STATUS.OK, appointments, 'Appointment queue fetched successfully').send(res);
});

// @desc    Vet approves/rejects/completes an appointment
// @route   PUT /api/vets/appointments/:id/status
// @access  Private (veterinarian)
const updateStatus = asyncHandler(async (req, res) => {
  const { status, vetNotes, cancelReason, meetingLink } = req.body;
  const appointment = await appointmentService.updateAppointmentStatus(
    req.params.id,
    req.user._id,
    status,
    { vetNotes, cancelReason, meetingLink }
  );
  new ApiResponse(HTTP_STATUS.OK, appointment, 'Appointment status updated').send(res);
});

// @desc    Owner cancels an appointment
// @route   PUT /api/vets/appointments/:id/cancel
// @access  Private (pet_owner)
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(
    req.params.id,
    req.user._id,
    req.body.cancelReason
  );
  new ApiResponse(HTTP_STATUS.OK, appointment, 'Appointment cancelled').send(res);
});

// @desc    Owner reschedules an appointment
// @route   PUT /api/vets/appointments/:id/reschedule
// @access  Private (pet_owner)
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, timeSlot } = req.body;
  const appointment = await appointmentService.rescheduleAppointment(
    req.params.id,
    req.user._id,
    date,
    timeSlot
  );
  new ApiResponse(HTTP_STATUS.OK, appointment, 'Appointment rescheduled').send(res);
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getVetQueue,
  updateStatus,
  cancelAppointment,
  rescheduleAppointment,
};
