import { useState } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const ChangePasswordModal = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(formData.oldPassword, formData.newPassword);
      toast.success('Password changed successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-primary-200">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Change Your Password</h2>
          <p className="text-secondary-600 text-sm">
            Your password has been reset by the administrator. Please set a new password to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              🔒 Current Password (Temporary Password)
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
                errors.oldPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-primary-200 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter the temporary password"
            />
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              🔑 New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
                errors.newPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-primary-200 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Enter your new password (min. 6 characters)"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              🔑 Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-primary-200 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Changing Password...
              </span>
            ) : (
              '✅ Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

