import axiosInstance from './axiosInstance';

export const authService = {
  register: (payload) => axiosInstance.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => axiosInstance.post('/auth/login', payload).then((res) => res.data),
  getMe: () => axiosInstance.get('/auth/me').then((res) => res.data),
  logout: () => axiosInstance.post('/auth/logout').then((res) => res.data),
  forgotPassword: (email) =>
    axiosInstance.post('/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (token, password) =>
    axiosInstance.post('/auth/reset-password', { token, password }).then((res) => res.data),
  changePassword: (currentPassword, newPassword) =>
    axiosInstance.put('/auth/change-password', { currentPassword, newPassword }).then((res) => res.data),
};
