import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            Join WasteMap
          </h2>
          <p className="text-secondary-600">Create your account and start reporting</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              👤 Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Enter your full name"
            />
          </div>
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
              minLength={6}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Minimum 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              📱 Phone <span className="text-secondary-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Enter your phone number"
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
                Registering...
              </span>
            ) : (
              '🚀 Create Account'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-secondary-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
