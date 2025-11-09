import { useState } from 'react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const TeamManagement = ({ teams, users, onTeamUpdated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    members: [],
  });

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await adminService.createTeam(formData);
      toast.success('Team created successfully!');
      setFormData({ name: '', leader: '', members: [] });
      setShowCreateForm(false);
      onTeamUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTeam(editingTeam._id, {
        name: formData.name,
        leader: formData.leader || null,
        members: formData.members,
      });
      toast.success('Team updated successfully!');
      setEditingTeam(null);
      setFormData({ name: '', leader: '', members: [] });
      onTeamUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update team');
    }
  };

  const startEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      leader: team.leader?._id || '',
      members: team.members?.map(m => m._id) || [],
    });
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setShowCreateForm(false);
    setFormData({ name: '', leader: '', members: [] });
  };

  // Filter users to only show workers
  const workerUsers = users.filter(user => user.role === 'worker');

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-primary-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary-800 flex items-center">
          <span className="text-3xl mr-3">👷</span> Team Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          ➕ Create Team
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTeam) && (
        <div className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-white rounded-xl border-2 border-primary-200 shadow-md">
          <h3 className="text-xl font-bold text-secondary-800 mb-5 flex items-center">
            <span className="text-2xl mr-2">{editingTeam ? '✏️' : '➕'}</span>
            {editingTeam ? 'Edit Team' : 'Create New Team'}
          </h3>
          <form onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Leader</label>
              <select
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">No Leader</option>
                {workerUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
              <select
                multiple
                value={formData.members}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, members: selectedIds });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[150px]"
              >
                {workerUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
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
                {editingTeam ? '💾 Update Team' : '🚀 Create Team'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team._id} className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-4 border-2 border-primary-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-secondary-800">{team.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(team)}
                  className="text-primary-600 hover:text-primary-700 font-semibold px-2 py-1 rounded-lg hover:bg-primary-50 transition-all duration-300"
                >
                  ✏️
                </button>
              </div>
            </div>
            {team.leader && (
              <p className="text-sm text-secondary-600 mb-2">
                <span className="font-semibold">Leader:</span> {team.leader.name}
              </p>
            )}
            <p className="text-sm text-secondary-600 mb-2">
              <span className="font-semibold">Members:</span> {team.members?.length || 0}
            </p>
            {team.members && team.members.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {team.members.slice(0, 3).map((member) => (
                  <span key={member._id} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                    {member.name}
                  </span>
                ))}
                {team.members.length > 3 && (
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs">
                    +{team.members.length - 3} more
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-secondary-500 mt-2">
              Status: <span className={`font-semibold ${team.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                {team.status}
              </span>
            </p>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="col-span-full text-center py-8 text-secondary-600">
            <div className="text-4xl mb-2">👷</div>
            <p>No teams created yet. Create your first team!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;

