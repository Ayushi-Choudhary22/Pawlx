import axiosInstance from './axiosInstance';

export const dashboardService = {
  get: () => axiosInstance.get('/dashboard').then((res) => res.data),
};

export const notificationService = {
  getMy: (unreadOnly = false) =>
    axiosInstance.get('/notifications', { params: { unread: unreadOnly } }).then((res) => res.data),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all').then((res) => res.data),
};

export const aiService = {
  sendMessage: (payload) => axiosInstance.post('/ai/chat', payload).then((res) => res.data),
  getConversations: () => axiosInstance.get('/ai/conversations').then((res) => res.data),
};
