import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getTeams: async () => {
    const response = await api.get('/admin/teams');
    return response.data;
  },

  createTeam: async (teamData) => {
    const response = await api.post('/admin/teams', teamData);
    return response.data;
  },

  updateTeam: async (id, teamData) => {
    const response = await api.put(`/admin/teams/${id}`, teamData);
    return response.data;
  },

  optimizeRoutes: async (params = {}) => {
    const response = await api.get('/admin/optimize-routes', { params });
    return response.data;
  },

  getPasswordResetRequests: async () => {
    const response = await api.get('/admin/password-reset-requests');
    return response.data;
  },

  resetUserPassword: async (userId, newPassword) => {
    const response = await api.post(`/admin/reset-password/${userId}`, { newPassword });
    return response.data;
  },
};
