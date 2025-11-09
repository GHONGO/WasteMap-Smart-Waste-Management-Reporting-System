import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const UserManagement = ({ users, teams, onUserUpdated, allowRoleCreation = false }) => {
  const { isSuperAdmin } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'citizen',
    team: '',
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(formData);
      toast.success('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'citizen',
        team: '',
      });
      setShowCreateForm(false);
      onUserUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(editingUser._id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        team: formData.team || null,
      });
      toast.success('User updated successfully!');
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'citizen',
        team: '',
      });
      onUserUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully!');
      onUserUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Don't show password
      phone: user.phone || '',
      role: user.role || 'citizen',
      team: user.team?._id || '',
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setShowCreateForm(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'citizen',
      team: '',
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-200 text-red-800',
      worker: 'bg-blue-200 text-blue-800',
      citizen: 'bg-gray-200 text-gray-800',
    };
    return colors[role] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-primary-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary-800 flex items-center">
          <span className="text-3xl mr-3">👥</span> User Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          ➕ Create User
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingUser) && (
        <div className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-white rounded-xl border-2 border-primary-200 shadow-md">
          <h3 className="text-xl font-bold text-secondary-800 mb-5 flex items-center">
            <span className="text-2xl mr-2">{editingUser ? '✏️' : '➕'}</span>
            {editingUser ? 'Edit User' : 'Create New User'}
          </h3>
          <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="citizen">Citizen</option>
                  <option value="worker">Worker</option>
                  {isSuperAdmin && <option value="admin">Admin (Municipal)</option>}
                  {isSuperAdmin && <option value="superadmin">Super Admin (Developer)</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">No Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-primary-200">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ❌ Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {editingUser ? '💾 Update User' : '🚀 Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-primary-200">
        <table className="min-w-full divide-y divide-primary-200">
          <thead className="bg-gradient-to-r from-primary-100 to-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.team?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="text-primary-600 hover:text-primary-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all duration-300"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
