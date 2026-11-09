import api from './api';
import { getTabId, isAnyTabActive } from '../utils/tabSession';

export const superAdminService = {
  // Super Admin Login
  async login({ identifier, password }) {
    try {
      const otherTabAlive = await isAnyTabActive();
      const forceReset = !otherTabAlive;

      const response = await api.post('/superadmin/auth/login', {
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
        err.response.data?.message || `Super Admin authentication failed with status ${err.response.status}`,
        { cause: err }
      );
    }
  },

  // Overview metrics and recent activity
  async getOverview() {
    const response = await api.get('/superadmin/overview');
    return response.data;
  },

  // Admin Applications
  async getApplications(params = {}) {
    const response = await api.get('/superadmin/applications', { params });
    return response.data;
  },

  async getApplication(id) {
    const response = await api.get(`/superadmin/applications/${id}`);
    return response.data;
  },

  async approveApplication(id, { permissions }) {
    const response = await api.post(`/superadmin/applications/${id}/approve`, { permissions });
    return response.data;
  },

  async rejectApplication(id, { reason }) {
    const response = await api.post(`/superadmin/applications/${id}/reject`, { reason });
    return response.data;
  },

  async requestApplicationInfo(id, { message }) {
    const response = await api.post(`/superadmin/applications/${id}/request-info`, { message });
    return response.data;
  },

  // Admin Management
  async getAdmins(params = {}) {
    const response = await api.get('/superadmin/admins', { params });
    return response.data;
  },

  async getAdmin(id) {
    const response = await api.get(`/superadmin/admins/${id}`);
    return response.data;
  },

  async createAdmin(data) {
    const response = await api.post('/superadmin/admins', data);
    return response.data;
  },

  async updateAdminStatus(id, { status, reason }) {
    const response = await api.patch(`/superadmin/admins/${id}/status`, { status, reason });
    return response.data;
  },

  async removeAdminRole(id, { reason } = {}) {
    const response = await api.delete(`/superadmin/admins/${id}/role`, { data: { reason } });
    return response.data;
  },

  async deleteAdmin(id, { reason }) {
    const response = await api.delete(`/superadmin/admins/${id}`, { data: { reason } });
    return response.data;
  },

  // Permissions Management
  async getPermissionCatalog() {
    const response = await api.get('/superadmin/permissions/catalog');
    return response.data;
  },

  async getAdminPermissions(adminId) {
    const response = await api.get(`/superadmin/permissions/${adminId}`);
    return response.data;
  },

  async updateAdminPermissions(adminId, { permissions, reason }) {
    const response = await api.put(`/superadmin/permissions/${adminId}`, { permissions, reason });
    return response.data;
  },

  // Developer / User Management
  async getUsers(params = {}) {
    const response = await api.get('/superadmin/users', { params });
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/superadmin/users/${id}`);
    return response.data;
  },

  async updateUserStatus(id, { status, reason }) {
    const response = await api.patch(`/superadmin/users/${id}/status`, { status, reason });
    return response.data;
  },

  async deleteUser(id, { reason }) {
    const response = await api.delete(`/superadmin/users/${id}`, { data: { reason } });
    return response.data;
  },

  async grantUserDeletePermission(adminId, { grant, reason }) {
    const response = await api.post(`/superadmin/users/${adminId}/grant-delete-permission`, { grant, reason });
    return response.data;
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    const response = await api.get('/superadmin/audit-logs', { params });
    return response.data;
  },

  // Notifications
  async getNotifications() {
    const response = await api.get('/superadmin/notifications');
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await api.patch(`/superadmin/notifications/${id}/read`);
    return response.data;
  },

  async markAllNotificationsRead() {
    const response = await api.patch('/superadmin/notifications/read-all');
    return response.data;
  },

  // Platform Settings
  async getSettings() {
    const response = await api.get('/superadmin/settings');
    return response.data;
  },

  async updateSettings(settings) {
    const response = await api.put('/superadmin/settings', { settings });
    return response.data;
  },

  // Public Admin Application
  async submitAdminApplication(data) {
    const response = await api.post('/admin/apply', data);
    return response.data;
  },

  async respondToInfoRequest(id, responseText) {
    const response = await api.post(`/admin/applications/${id}/respond`, { response: responseText });
    return response.data;
  },
};

export default superAdminService;
