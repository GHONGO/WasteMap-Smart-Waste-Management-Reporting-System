import api from './api';

export const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  updateReportStatus: async (id, status, note) => {
    const response = await api.put(`/reports/${id}/status`, { status, note });
    return response.data;
  },

  assignReport: async (id, assignmentData) => {
    const response = await api.put(`/reports/${id}/assign`, assignmentData);
    return response.data;
  },

  getNearbyReports: async (latitude, longitude, radius = 5000) => {
    const response = await api.get('/reports/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },
};
