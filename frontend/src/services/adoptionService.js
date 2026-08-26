import axiosInstance from './axiosInstance';

export const adoptionService = {
  list: (params) => axiosInstance.get('/adoption', { params }).then((res) => res.data),
  getById: (id) => axiosInstance.get(`/adoption/${id}`).then((res) => res.data),
  create: (payload) => axiosInstance.post('/adoption', payload).then((res) => res.data),
  apply: (id, formData) =>
    axiosInstance
      .post(`/adoption/${id}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  getMyApplications: () => axiosInstance.get('/adoption/applications/my').then((res) => res.data),
  reviewApplication: (appId, status) =>
    axiosInstance.put(`/adoption/applications/${appId}/review`, { status }).then((res) => res.data),
};
