import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://markiitbackend.vercel.app/api';

const getAuthRedirectUrl = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'admin') return '/system-access-portal';
  return '/login';
};

let isRefreshing = false;

const handleAuthFailure = () => {
  const redirectUrl = getAuthRedirectUrl();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  window.location.href = redirectUrl;
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) return Promise.reject(error);

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data, config) => api.post('/auth/login', data, config),
  logout: () => api.post('/auth/logout'),
  getMe: (config) => api.get('/auth/me', config),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  getPublicProfile: (id) => api.get(`/users/${id}/public`),
  updateProfile: (data) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getNearby: (data) => api.post('/users/nearby', data),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  toggleFavorite: (id) => api.post(`/products/${id}/favorite`),
  getFavorites: (params) => api.get('/products/favorites', { params }),
  getMy: (params) => api.get('/products/my', { params }),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getMy: (params) => api.get('/services/my', { params }),
};

export const nearbyAPI = {
  getNearby: (params) => api.get('/listings/nearby', { params }),
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getReceived: (params) => api.get('/bookings/received', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getServiceReviews: (serviceId) => api.get(`/reviews/service/${serviceId}`),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

export const reportsAPI = {
  create: (data) => api.post('/reports', data),
  getContentReports: (contentType, contentId) => api.get(`/reports/content/${contentType}/${contentId}`),
};

export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (roomId) => api.get('/messages', { params: { roomId } }),
  send: (data) => api.post('/messages', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: () => api.get('/admin/dashboard/activity'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  getProducts: (params) => api.get('/admin/products', { params }),
  updateProductStatus: (id, status) => api.put(`/admin/products/${id}/status`, { status }),
  getServices: (params) => api.get('/admin/services', { params }),
  updateServiceStatus: (id, status) => api.put(`/admin/services/${id}/status`, { status }),
  getReports: (params) => api.get('/admin/reports', { params }),
  resolveReport: (id) => api.put(`/admin/reports/${id}/resolve`),
};
