import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🗑️</div>
          <div className="text-primary-600 font-semibold text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
