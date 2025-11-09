import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('AuthContext: Initialized with user:', userData);
          setUser(userData);
          setMustChangePassword(userData.mustChangePassword || false);
        } catch (error) {
          console.error('AuthContext: Failed to get current user:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      console.log('AuthContext: Login successful, user data:', userData);
      setUser(userData);
      setMustChangePassword(userData.mustChangePassword || false);
      return userData;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setMustChangePassword(userData.mustChangePassword || false);
      return userData;
    } catch (error) {
      console.error('AuthContext: Failed to refresh user:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    mustChangePassword,
    setMustChangePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin',
    isWorker: user?.role === 'worker' || user?.role === 'admin' || user?.role === 'superadmin',
    isMunicipal: user?.role === 'admin', // Municipal admin (not superadmin)
  };

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log('AuthContext: User state updated:', {
        name: user.name,
        email: user.email,
        role: user.role,
        isAuthenticated: !!user,
        isSuperAdmin: user.role === 'superadmin',
        isAdmin: user.role === 'admin' || user.role === 'superadmin',
      });
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
