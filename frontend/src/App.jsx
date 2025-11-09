import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MapView from './pages/MapView';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Dashboard from './pages/Dashboard';
import SuperAdmin from './pages/SuperAdmin';
import PrivateRoute from './components/PrivateRoute';
import ChangePasswordModal from './components/ChangePasswordModal';

const AppRoutes = () => {
  const { isAuthenticated, loading, mustChangePassword, refreshUser, setMustChangePassword } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🗑️</div>
          <div className="text-primary-600 font-semibold text-lg">Loading WasteMap...</div>
        </div>
      </div>
    );
  }

  const handlePasswordChangeSuccess = async () => {
    // Refresh user data to get updated mustChangePassword status
    await refreshUser();
    setMustChangePassword(false);
    // Navigate to home after successful password change
    window.location.href = '/';
  };

  return (
    <Router>
      <Navbar />
      {mustChangePassword && isAuthenticated && (
        <ChangePasswordModal onSuccess={handlePasswordChangeSuccess} />
      )}
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated && !mustChangePassword ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <MapView />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <PrivateRoute>
              <ReportDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute adminOnly>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <PrivateRoute superAdminOnly>
              <SuperAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
