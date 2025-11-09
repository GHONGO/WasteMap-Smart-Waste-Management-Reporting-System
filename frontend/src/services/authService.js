import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    try {
      console.log('authService: Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('authService: Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('authService: Token and user stored in localStorage');
      } else {
        console.warn('authService: No token in response');
      }
      return response.data;
    } catch (error) {
      console.error('authService: Login error:', error);
      console.error('authService: Error response:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },
};
