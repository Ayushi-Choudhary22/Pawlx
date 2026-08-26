import api from './axiosInstance';

export const temporaryAdoptionService = {
  create: (data) => api.post('/temporary-adoption', data).then((res) => res.data),
  list: (params) => api.get('/temporary-adoption', { params }).then((res) => res.data),
  getMyDashboard: () => api.get('/temporary-adoption/my-dashboard').then((res) => res.data),
  connect: (id, data) => api.post(`/temporary-adoption/listings/${id}/connect`, data).then((res) => res.data),
  respondToRequest: (requestId, status) => api.put(`/temporary-adoption/requests/${requestId}`, { status }).then((res) => res.data),
};
