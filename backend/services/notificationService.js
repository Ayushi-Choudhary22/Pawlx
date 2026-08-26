const Notification = require('../models/Notification');

const createNotification = async ({ user, type, title, message, link }) =>
  Notification.create({ user, type, title, message, link });

const getMyNotifications = async (userId, unreadOnly = false) => {
  const query = { user: userId };
  if (unreadOnly) query.isRead = false;
  return Notification.find(query).sort({ createdAt: -1 }).limit(50);
};

const markAsRead = async (notificationId, userId) =>
  Notification.findOneAndUpdate({ _id: notificationId, user: userId }, { isRead: true }, { new: true });

const markAllAsRead = async (userId) =>
  Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

module.exports = { createNotification, getMyNotifications, markAsRead, markAllAsRead };
