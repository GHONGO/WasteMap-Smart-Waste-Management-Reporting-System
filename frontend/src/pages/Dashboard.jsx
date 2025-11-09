import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import UserManagement from '../components/UserManagement';
import TeamManagement from '../components/TeamManagement';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    if (activeTab === 'users' || activeTab === 'teams') {
      loadUsers();
      loadTeams();
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

  const handleOptimizeRoutes = async () => {
    try {
      setOptimizedRoute(null);
      const data = await adminService.optimizeRoutes({ maxReports: 10 });
      setOptimizedRoute(data);
      if (data.route && data.route.length > 0) {
        toast.success(`Routes optimized! Found ${data.totalReports} reports to process.`);
      } else {
        toast.info('No pending reports found to optimize.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to optimize routes');
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

  const handleUserUpdated = () => {
    loadUsers();
    loadDashboardData(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">📊</div>
          <div className="text-primary-600 font-semibold text-lg">Loading dashboard...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-secondary-600 text-lg">Monitor and manage your waste management system</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-2 border border-primary-200">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'teams'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              👷 Team Management
            </button>
          </nav>
        </div>

        {activeTab === 'users' ? (
          <UserManagement users={users} teams={teams} onUserUpdated={handleUserUpdated} allowRoleCreation={false} />
        ) : activeTab === 'teams' ? (
          <TeamManagement teams={teams} users={users} onTeamUpdated={handleUserUpdated} />
        ) : (
          <>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group"
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

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Reports by Priority */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span> Reports by Priority
            </h2>
            <div className="space-y-2">
              {stats.reportsByPriority?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{item._id || 'N/A'}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item._id === 'high' ? 'bg-red-500' :
                          item._id === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-800 font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports by Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">📊</span> Reports by Status
            </h2>
            <div className="space-y-2">
              {stats.reportsByStatus?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{item._id || 'N/A'}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gray-600"
                        style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-800 font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Optimization */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-800 flex items-center">
              <span className="text-3xl mr-3">🗺️</span> Route Optimization
            </h2>
            <button
              onClick={handleOptimizeRoutes}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🚀 Optimize Routes
            </button>
          </div>
          {optimizedRoute ? (
            optimizedRoute.route && optimizedRoute.route.length > 0 ? (
              <div className="mt-4">
                <div className="bg-gradient-to-r from-green-50 to-primary-50 rounded-xl p-4 mb-4 border-2 border-green-200">
                  <p className="text-lg font-bold text-secondary-800 mb-1">
                    ✅ Optimized Route Generated
                  </p>
                  <p className="text-sm text-secondary-600 mb-1">
                    📋 Total Reports: <span className="font-bold text-primary-600">{optimizedRoute.totalReports}</span>
                  </p>
                  <p className="text-sm text-secondary-600">
                    ⏱️ Estimated Time: <span className="font-bold text-primary-600">{optimizedRoute.estimatedTime} minutes</span> ({Math.round(optimizedRoute.estimatedTime / 60)} hours)
                  </p>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {optimizedRoute.route.map((stop, index) => (
                    <div key={index} className="bg-gradient-to-r from-primary-50 to-white p-4 rounded-xl border-2 border-primary-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              stop.priority === 'high' ? 'bg-red-100 text-red-700' :
                              stop.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {stop.priority.toUpperCase()}
                            </span>
                            <span className="text-sm font-semibold text-primary-600">
                              📍 {stop.distance.toFixed(2)} km
                            </span>
                          </div>
                          <p className="text-sm text-secondary-700">{stop.description || 'No description'}</p>
                          <p className="text-xs text-secondary-500 mt-1">
                            📍 Location: [{stop.location[1].toFixed(4)}, {stop.location[0].toFixed(4)}]
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-secondary-700 font-semibold">⚠️ No pending reports found to optimize.</p>
                <p className="text-sm text-secondary-600 mt-1">All reports are either completed or cancelled.</p>
              </div>
            )
          ) : (
            <div className="mt-4 bg-primary-50 border-2 border-primary-200 rounded-xl p-4 text-center">
              <p className="text-secondary-600">Click "Optimize Routes" to generate an optimized route for pending reports.</p>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
