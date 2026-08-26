import axiosInstance from './axiosInstance';

export const adminService = {
  getAnalytics: () => axiosInstance.get('/admin/analytics').then((res) => res.data),
  listUsers: (params) => axiosInstance.get('/admin/users', { params }).then((res) => res.data),
  toggleUserActive: (id, isActive) =>
    axiosInstance.put(`/admin/users/${id}/status`, { isActive }).then((res) => res.data),
  approveProfessional: (id) => axiosInstance.put(`/admin/users/${id}/approve`).then((res) => res.data),
  listAllOrders: () => axiosInstance.get('/admin/orders').then((res) => res.data),
  listPendingApplications: () =>
    axiosInstance.get('/admin/adoption-applications/pending').then((res) => res.data),
};

export const categoryService = {
  list: () => axiosInstance.get('/categories').then((res) => res.data),
  create: (payload) => axiosInstance.post('/categories', payload).then((res) => res.data),
  update: (id, payload) => axiosInstance.put(`/categories/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosInstance.delete(`/categories/${id}`).then((res) => res.data),
};

export const productAdminService = {
  list: (params) => axiosInstance.get('/products', { params }).then((res) => res.data),
  create: (payload) => axiosInstance.post('/products', payload).then((res) => res.data),
  update: (id, payload) => axiosInstance.put(`/products/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosInstance.delete(`/products/${id}`).then((res) => res.data),
};
