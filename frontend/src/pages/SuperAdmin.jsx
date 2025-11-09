import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import UserManagement from '../components/UserManagement';
import TeamManagement from '../components/TeamManagement';
import toast from 'react-hot-toast';

const SuperAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [resetPasswordModal, setResetPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    loadDashboardData();
    if (activeTab === 'users' || activeTab === 'teams') {
      loadUsers();
      loadTeams();
    }
    if (activeTab === 'password-resets') {
      loadPasswordResetRequests();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadTeams = async () => {
    try {
      const data = await adminService.getTeams();
      setTeams(data);
    } catch (error) {
      toast.error('Failed to load teams');
    }
  };

  const loadPasswordResetRequests = async () => {
    try {
      const data = await adminService.getPasswordResetRequests();
      setPasswordResetRequests(data);
    } catch (error) {
      toast.error('Failed to load password reset requests');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setResettingPassword(true);
    try {
      await adminService.resetUserPassword(resetPasswordModal._id, newPassword);
      toast.success('Password reset successfully! User will be required to change password on next login.');
      setResetPasswordModal(null);
      setNewPassword('');
      loadPasswordResetRequests();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleUserUpdated = () => {
    loadUsers();
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">⚙️</div>
          <div className="text-primary-600 font-semibold text-lg">Loading super admin panel...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    { label: 'Total Reports', value: stats.totalReports, color: 'from-blue-500 to-blue-600', icon: '📋' },
    { label: 'Pending', value: stats.pendingReports, color: 'from-yellow-500 to-yellow-600', icon: '⏳' },
    { label: 'In Progress', value: stats.inProgressReports, color: 'from-orange-500 to-orange-600', icon: '🔄' },
    { label: 'Completed', value: stats.completedReports, color: 'from-green-500 to-green-600', icon: '✅' },
    { label: 'Total Users', value: stats.totalUsers, color: 'from-purple-500 to-purple-600', icon: '👥' },
    { label: 'Total Teams', value: stats.totalTeams, color: 'from-indigo-500 to-indigo-600', icon: '👷' },
    { label: 'Recent (7 days)', value: stats.recentReports, color: 'from-pink-500 to-pink-600', icon: '📅' },
    { label: 'Avg Time (min)', value: stats.avgCompletionTime, color: 'from-cyan-500 to-cyan-600', icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">
            ⚙️ Super Admin Portal
          </h1>
          <p className="text-secondary-600 text-lg">Developer control panel - Full system access</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-2 border border-purple-200">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'teams'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              👷 Team Management
            </button>
            <button
              onClick={() => setActiveTab('password-resets')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'password-resets'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              🔑 Password Resets
            </button>
          </nav>
        </div>

        {activeTab === 'users' ? (
          <UserManagement users={users} teams={teams} onUserUpdated={handleUserUpdated} allowRoleCreation={true} />
        ) : activeTab === 'teams' ? (
          <TeamManagement teams={teams} users={users} onTeamUpdated={handleUserUpdated} />
        ) : activeTab === 'password-resets' ? (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🔑</span> Password Reset Requests
            </h2>
            {passwordResetRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-secondary-600 text-lg">No pending password reset requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {passwordResetRequests.map((user) => (
                  <div
                    key={user._id}
                    className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl border border-purple-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-secondary-800">{user.name}</p>
                      <p className="text-sm text-secondary-600">{user.email}</p>
                      <p className="text-xs text-secondary-500 mt-1">
                        Role: {user.role} • Requested: {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setResetPasswordModal(user)}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Reset Password
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-100 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  </div>
                  <p className="text-xs font-semibold text-secondary-500 mb-1 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200 mb-8">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">🔧</span> System Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                  <p className="text-sm font-semibold text-secondary-600 mb-1">System Status</p>
                  <p className="text-lg font-bold text-green-600">✅ Operational</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                  <p className="text-sm font-semibold text-secondary-600 mb-1">Access Level</p>
                  <p className="text-lg font-bold text-purple-600">🔐 Super Admin</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Password Reset Modal */}
        {resetPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🔑</div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">Reset Password</h2>
                <p className="text-secondary-600 text-sm">
                  Set a new temporary password for <strong>{resetPasswordModal.name}</strong> ({resetPasswordModal.email})
                </p>
                <p className="text-secondary-500 text-xs mt-2">
                  The user will be required to change this password on their next login.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    🔒 New Temporary Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                    placeholder="Enter new password (min. 6 characters)"
                    minLength={6}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setResetPasswordModal(null);
                      setNewPassword('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-secondary-300 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={resettingPassword || !newPassword || newPassword.length < 6}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {resettingPassword ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;

