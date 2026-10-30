import api from './api';

export const authService = {
  /**
   * User Login
   * @param {Object} credentials
   * @param {string} credentials.identifier - Email or Username
   * @param {string} credentials.password - Password
   */
  async login({ identifier, password }) {
    try {
      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
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
   * User Registration
   * @param {Object} userData
   */
  async signup({ username, email, password }) {
    try {
      const response = await api.post('/auth/signup', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
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
   * Get OAuth redirection URL
   */
  getOAuthUrl(provider) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseURL}/auth/oauth/${provider}`;
  },
};

export default authService;
