import api from './api';

export const profileService = {
  /**
   * Fetch full developer profile for the authenticated user
   */
  async getProfile() {
    try {
      const response = await api.get('/users/me/profile');
      return response.data?.user || response.data;
    } catch {
      // Fallback to /auth/me if /users/me/profile is not available
      const fallback = await api.get('/auth/me');
      return fallback.data?.user || fallback.data;
    }
  },

  /**
   * Update permitted profile fields: name, socialLinks, skills
   * @param {Object} data
   */
  async updateProfile(data) {
    try {
      const response = await api.patch('/users/me/profile', data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      throw new Error(msg, { cause: err });
    }
  },

  /**
   * Update username (enforces 30-day limit and uniqueness on server)
   * @param {string} username
   */
  async updateUsername(username) {
    try {
      const response = await api.patch('/users/me/username', { username });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update username';
      throw new Error(msg, { cause: err });
    }
  },

  /**
   * Set phone number for the first time (immutable once set)
   * @param {Object} payload { phone, phoneVisibility }
   */
  async setPhone({ phone, phoneVisibility }) {
    try {
      const response = await api.post('/users/me/phone', {
        phone,
        phoneVisibility: phoneVisibility || 'private',
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to set phone number';
      throw new Error(msg, { cause: err });
    }
  },

  /**
   * Update phone visibility preference (private / public)
   * @param {string} phoneVisibility
   */
  async updatePhoneVisibility(phoneVisibility) {
    try {
      const response = await api.patch('/users/me/phone-visibility', {
        phoneVisibility,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update phone visibility';
      throw new Error(msg, { cause: err });
    }
  },

  /**
   * Upload profile avatar to Cloudinary
   * @param {File} file
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload profile picture';
      throw new Error(msg, { cause: err });
    }
  },

  /**
   * Remove custom avatar (restore default robot)
   */
  async removeAvatar() {
    try {
      const response = await api.delete('/users/me/avatar');
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove profile picture';
      throw new Error(msg, { cause: err });
    }
  },
};

export default profileService;
