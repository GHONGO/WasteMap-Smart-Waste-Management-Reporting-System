import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      await authService.requestPasswordReset(resetEmail);
      toast.success('Password reset request submitted. The superadmin will be notified.');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit password reset request');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(formData);
      console.log('Login successful, user data:', userData);
      
      if (!userData || !userData.token) {
        toast.error('Login failed: No token received');
        return;
      }
      
      toast.success(`Login successful! Welcome ${userData.name}`);
      
      // If password change is required, don't navigate - let App.jsx handle it
      if (userData.mustChangePassword) {
        // The App.jsx will show the password change modal
        return;
      }
      
      // Force navigation - don't wait for state update
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      console.log('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-primary-200/50 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-slow">🗑️</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-secondary-600">Login to your WasteMap account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              🔒 Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Logging in...
              </span>
            ) : (
              '🚀 Login'
            )}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-center">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors text-sm"
            >
              🔑 Forgot Password?
            </button>
          </p>
          <p className="text-center text-sm text-secondary-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-primary-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔑</div>
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">Request Password Reset</h2>
              <p className="text-secondary-600 text-sm">
                Enter your email address. The superadmin will be notified and will reset your password.
              </p>
            </div>
            <form onSubmit={handleRequestPasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-secondary-300 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {resetLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
