const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const calendarService = require('../services/calendarService');

// @desc    Get a unified calendar feed for the logged-in pet owner
// @route   GET /api/calendar
// @access  Private
const getMyCalendarEvents = asyncHandler(async (req, res) => {
  const events = await calendarService.getMyCalendarEvents(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, events, 'Calendar events fetched successfully').send(res);
});

module.exports = { getMyCalendarEvents };
