import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401
      Cookies.remove('token');
      // Only redirect to login if it's not an upload request and we're not already on login page
      if (typeof window !== 'undefined' && 
          !error.config?.url?.includes('/videos') && 
          !window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  me: () => apiClient.get('/users/me'),
};

// User APIs
export const userAPI = {
  getProfile: (userId: string) => apiClient.get(`/users/${userId}`),
  updateProfile: (data: any) => apiClient.patch('/users/me', data),
  follow: (userId: string) => apiClient.post(`/users/${userId}/follow`),
  unfollow: (userId: string) => apiClient.delete(`/users/${userId}/follow`),
  getFollowing: () => apiClient.get('/users/me/following'),
  getFollowers: () => apiClient.get('/users/me/followers'),
};

// Video APIs
export const videoAPI = {
  getPublic: (params?: any) => apiClient.get('/videos', { params }),
  create: (data: any) => apiClient.post('/videos', data),
  update: (videoId: string, data: any) => apiClient.patch(`/videos/${videoId}`, data),
  delete: (videoId: string) => apiClient.delete(`/videos/${videoId}`),
  getById: (videoId: string) => apiClient.get(`/videos/${videoId}`),
  like: (videoId: string) => apiClient.post(`/videos/${videoId}/like`),
  unlike: (videoId: string) => apiClient.delete(`/videos/${videoId}/like`),
  createReview: (videoId: string, data: any) =>
    apiClient.post(`/videos/${videoId}/reviews`, data),
};

// Feed APIs
export const feedAPI = {
  getFollowingFeed: (params?: any) => apiClient.get('/videos/feed/following', { params }),
  getTrendingFeed: (params?: any) => apiClient.get('/videos/feed/trending', { params }),
};

// Admin APIs
export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats'),
  getHealth: () => apiClient.get('/admin/health'),
};

export default apiClient;
