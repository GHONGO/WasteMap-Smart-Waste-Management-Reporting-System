import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isSuperAdmin, isMunicipal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-primary-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-600 transition-all duration-300">
              🗑️ WasteMap
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/map"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50"
                >
                  📍 Map
                </Link>
                <Link
                  to="/reports"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50"
                >
                  📋 My Reports
                </Link>
                {isMunicipal && (
                  <Link
                    to="/dashboard"
                    className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50"
                  >
                    🏛️ Municipal Portal
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link
                    to="/superadmin"
                    className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50"
                  >
                    ⚙️ Super Admin
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-secondary-600 text-sm font-medium bg-secondary-50 px-3 py-1.5 rounded-full">
                  👤 {user?.name} <span className={`font-semibold ${
                    user?.role === 'superadmin' ? 'text-purple-600' :
                    user?.role === 'admin' ? 'text-blue-600' :
                    user?.role === 'worker' ? 'text-orange-600' :
                    'text-primary-600'
                  }`}>({user?.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
