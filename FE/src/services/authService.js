import api from './api';
import { getTabId, isAnyTabActive } from '../utils/tabSession';

export const authService = {
  /**
   * User Login with Tab Identification and Liveness Check
   * @param {Object} credentials
   */
  async login({ identifier, password }) {
    try {
      // Check if another active tab is truly still open in this browser
      const otherTabAlive = await isAnyTabActive();
      const forceReset = !otherTabAlive;

      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
        tabId: getTabId(),
        forceReset,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(
          'Cannot connect to backend server at http://localhost:5000. Ensure your Express server is running.',
          { cause: err }
        );
      }
      throw new Error(
        err.response.data?.message || `Login failed with status ${err.response.status}`,
        { cause: err }
      );
    }
  },

  /**
   * User Registration with Tab Identification
   * @param {Object} userData
   */
  async signup({ username, email, password }) {
    try {
      const response = await api.post('/auth/signup', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        tabId: getTabId(),
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(
          'Cannot connect to backend server at http://localhost:5000. Ensure your Express server is running.',
          { cause: err }
        );
      }
      throw new Error(
        err.response.data?.message || `Sign up failed with status ${err.response.status}`,
        { cause: err }
      );
    }
  },

  /**
   * Fetch current authenticated user
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data?.user || response.data;
    } catch {
      return null;
    }
  },

  /**
   * User Logout
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network failure on logout; client will clear tokens anyway
    }
  },

  /**
   * Heartbeat to keep backend session alive during active user interaction
   */
  async pingActivity() {
    try {
      await api.post('/auth/activity');
    } catch {
      // Ignore background heartbeat errors
    }
  },

  /**
   * Password Reset Request
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(
          'Backend server not reachable at http://localhost:5000. In production, this will dispatch a secure reset token.',
          { cause: err }
        );
      }
      throw new Error(
        err.response.data?.message || 'Failed to send password reset request',
        { cause: err }
      );
    }
  },

  /**
   * Get OAuth redirection URL with tabId preservation
   */
  getOAuthUrl(provider) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const tabId = getTabId();
    return `${baseURL}/auth/oauth/${provider}?tabId=${encodeURIComponent(tabId)}`;
  },
};

export default authService;
