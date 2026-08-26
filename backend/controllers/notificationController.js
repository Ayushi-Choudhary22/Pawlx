const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const notificationService = require('../services/notificationService');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getMyNotifications(req.user._id, req.query.unread === 'true');
  new ApiResponse(HTTP_STATUS.OK, notifications, 'Notifications fetched successfully').send(res);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, notification, 'Notification marked as read').send(res);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, null, 'All notifications marked as read').send(res);
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
