import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ad_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT attempt refresh on login or signup routes
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/signup');

    // If 401 Unauthorized on protected routes and not already retried
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {});
        if (refreshRes.data?.token) {
          localStorage.setItem('ad_auth_token', refreshRes.data.token);
          originalRequest.headers.Authorization = `Bearer ${refreshRes.data.token}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh failed or not supported; clear session
        localStorage.removeItem('ad_auth_token');
        localStorage.removeItem('ad_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
