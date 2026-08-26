import axiosInstance from './axiosInstance';

export const productService = {
  list: (params) => axiosInstance.get('/products', { params }).then((res) => res.data),
  getBySlug: (slug) => axiosInstance.get(`/products/${slug}`).then((res) => res.data),
  getFeatured: () => axiosInstance.get('/products/featured').then((res) => res.data),
  getTrending: () => axiosInstance.get('/products/trending').then((res) => res.data),
};

export const cartService = {
  get: () => axiosInstance.get('/cart').then((res) => res.data),
  addItem: (productId, quantity = 1) =>
    axiosInstance.post('/cart/items', { productId, quantity }).then((res) => res.data),
  updateQuantity: (productId, quantity) =>
    axiosInstance.put(`/cart/items/${productId}`, { quantity }).then((res) => res.data),
  removeItem: (productId) => axiosInstance.delete(`/cart/items/${productId}`).then((res) => res.data),
  clear: () => axiosInstance.delete('/cart').then((res) => res.data),
};

export const wishlistService = {
  get: () => axiosInstance.get('/wishlist').then((res) => res.data),
  toggle: (productId) => axiosInstance.post('/wishlist/toggle', { productId }).then((res) => res.data),
};

export const orderService = {
  placeOrder: (payload) => axiosInstance.post('/orders', payload).then((res) => res.data),
  getMyOrders: () => axiosInstance.get('/orders/my').then((res) => res.data),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`).then((res) => res.data),
};
