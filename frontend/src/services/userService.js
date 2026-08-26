import axiosInstance from './axiosInstance';

export const userService = {
  updateProfile: (payload) => axiosInstance.put('/users/profile', payload).then((res) => res.data),
  uploadAvatar: (formData) =>
    axiosInstance
      .post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
};
