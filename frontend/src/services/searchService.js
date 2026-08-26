import axiosInstance from './axiosInstance';

export const searchService = {
  search: (query) => axiosInstance.get('/search', { params: { q: query } }).then((res) => res.data),
};
