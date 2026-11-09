import axios from 'axios';
import { getTabToken, getTabId, clearTabSession } from '../utils/tabSession';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to attach tab-scoped JWT token and tabId header
api.interceptors.request.use(
  (config) => {
    const token = getTabToken();
    const tabId = getTabId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tabId) {
      config.headers['x-tab-id'] = tabId;
    }

    // When sending FormData, delete Content-Type so the browser sets multipart/form-data with the correct boundary
    if (config.data instanceof FormData || (config.data && typeof config.data.append === 'function')) {
      if (config.headers?.delete) {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      }
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session timeouts and tab mismatches cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Handle idle timeout, absolute expiration, tab mismatch, or revocation
    if (
      status === 401 &&
      (code === 'SESSION_IDLE' ||
        code === 'SESSION_EXPIRED' ||
        code === 'TAB_MISMATCH' ||
        code === 'SESSION_REVOKED')
    ) {
      clearTabSession();
      const reason = code === 'SESSION_IDLE' ? 'idle' : 'expired';
      window.dispatchEvent(new CustomEvent('ad_session_expired', { detail: { reason } }));
    }

    return Promise.reject(error);
  }
);

export default api;
