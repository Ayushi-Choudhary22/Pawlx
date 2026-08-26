import axiosInstance from './axiosInstance';

export const professionalService = {
  getById: (id) => axiosInstance.get(`/users/professional/${id}`).then((res) => res.data),
};

export const vetService = {
  list: (params) => axiosInstance.get('/vets', { params }).then((res) => res.data),
  bookAppointment: (payload) => axiosInstance.post('/vets/appointments', payload).then((res) => res.data),
  getMyAppointments: (status) =>
    axiosInstance.get('/vets/appointments/my', { params: { status } }).then((res) => res.data),
  cancelAppointment: (id, cancelReason) =>
    axiosInstance.put(`/vets/appointments/${id}/cancel`, { cancelReason }).then((res) => res.data),
  rescheduleAppointment: (id, date, timeSlot) =>
    axiosInstance.put(`/vets/appointments/${id}/reschedule`, { date, timeSlot }).then((res) => res.data),
  getQueue: (status) => axiosInstance.get('/vets/appointments/queue', { params: { status } }).then((res) => res.data),
  updateStatus: (id, status, extra) =>
    axiosInstance.put(`/vets/appointments/${id}/status`, { status, ...extra }).then((res) => res.data),
};

export const petSitterService = {
  list: (params) => axiosInstance.get('/petsitters', { params }).then((res) => res.data),
  createBooking: (payload) => axiosInstance.post('/petsitters/bookings', payload).then((res) => res.data),
  getMyBookings: () => axiosInstance.get('/petsitters/bookings/my').then((res) => res.data),
  cancelBooking: (id) => axiosInstance.put(`/petsitters/bookings/${id}/cancel`).then((res) => res.data),
  getQueue: (status) => axiosInstance.get('/petsitters/bookings/queue', { params: { status } }).then((res) => res.data),
  updateStatus: (id, status) =>
    axiosInstance.put(`/petsitters/bookings/${id}/status`, { status }).then((res) => res.data),
};

export const groomingService = {
  list: (params) => axiosInstance.get('/grooming', { params }).then((res) => res.data),
  createBooking: (payload) => axiosInstance.post('/grooming/bookings', payload).then((res) => res.data),
  getMyBookings: () => axiosInstance.get('/grooming/bookings/my').then((res) => res.data),
  cancelBooking: (id) => axiosInstance.put(`/grooming/bookings/${id}/cancel`).then((res) => res.data),
  getQueue: (status) => axiosInstance.get('/grooming/bookings/queue', { params: { status } }).then((res) => res.data),
  updateStatus: (id, status) =>
    axiosInstance.put(`/grooming/bookings/${id}/status`, { status }).then((res) => res.data),
};
