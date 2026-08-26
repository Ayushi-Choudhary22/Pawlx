import axiosInstance from './axiosInstance';

export const reviewService = {
  getForTarget: (targetType, targetId) =>
    axiosInstance.get(`/reviews/${targetType}/${targetId}`).then((res) => res.data),
  create: (payload) => axiosInstance.post('/reviews', payload).then((res) => res.data),
  markHelpful: (id) => axiosInstance.put(`/reviews/${id}/helpful`).then((res) => res.data),
};
