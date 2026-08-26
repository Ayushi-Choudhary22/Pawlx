import axiosInstance from './axiosInstance';

export const calendarService = {
  getMyEvents: () => axiosInstance.get('/calendar').then((res) => res.data),
};
