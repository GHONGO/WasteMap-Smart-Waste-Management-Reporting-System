import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { adminService } from '../services/adminService';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isWorker } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [statusNote, setStatusNote] = useState('');
  const socket = useSocket();

  useEffect(() => {
    loadReport();
    if (socket) {
      socket.emit('join-report', id);
      socket.on('report-updated', (updatedReport) => {
        if (updatedReport._id === id) {
          setReport(updatedReport);
        }
      });

      return () => {
        socket.emit('leave-report', id);
        socket.off('report-updated');
      };
    }
  }, [id, socket]);

  useEffect(() => {
    if (isAdmin) {
      loadTeams();
      loadWorkers();
    }
  }, [isAdmin]);

  const loadReport = async () => {
    try {
      const data = await reportService.getReportById(id);
      setReport(data);
    } catch (error) {
      toast.error('Failed to load report');
      navigate('/reports');
    } finally {
      setLoading(false);
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

  const loadWorkers = async () => {
    try {
      const users = await adminService.getUsers();
      // Filter only workers
      const workerUsers = users.filter(user => user.role === 'worker');
      setWorkers(workerUsers);
    } catch (error) {
      toast.error('Failed to load workers');
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await reportService.updateReportStatus(id, status, statusNote);
      toast.success('Status updated successfully');
      setStatusNote('');
      loadReport();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignTeam = async (teamId) => {
    try {
      await reportService.assignReport(id, { teamId });
      toast.success('Team assigned successfully');
      loadReport();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign team');
    }
  };

  const handleAssignWorker = async (userIds) => {
    try {
      await reportService.assignReport(id, { userIds });
      toast.success('Worker(s) assigned successfully');
      loadReport();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign worker(s)');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">📄</div>
          <div className="text-primary-600 font-semibold text-lg">Loading report...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-300 text-gray-800',
      assigned: 'bg-blue-200 text-blue-800',
      'in-progress': 'bg-yellow-200 text-yellow-800',
      completed: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/reports')}
          className="mb-6 text-secondary-600 hover:text-primary-600 font-semibold flex items-center transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Reports
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-primary-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
                📄 Report Details
              </h1>
              <p className="text-secondary-600">View and manage report information</p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border border-primary-200">
              <h2 className="text-xl font-bold text-secondary-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">📝</span> Description
              </h2>
              <p className="text-secondary-700 leading-relaxed">{report.description}</p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border border-primary-200">
              <h2 className="text-xl font-bold text-secondary-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">📍</span> Location
              </h2>
              <p className="text-secondary-700 font-medium mb-2">
                {report.address || `${report.location.coordinates[1]}, ${report.location.coordinates[0]}`}
              </p>
              <p className="text-sm text-secondary-500 font-mono">
                Coordinates: {report.location.coordinates[1]}, {report.location.coordinates[0]}
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border border-primary-200">
              <h2 className="text-xl font-bold text-secondary-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎯</span> Priority
              </h2>
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md inline-block ${
                report.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-300' :
                report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {report.priority}
              </span>
            </div>

            {report.images && report.images.length > 0 && (
              <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border border-primary-200">
                <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📸</span> Images
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {report.images.map((img, index) => (
                    <div key={index} className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <img
                        src={img.url}
                        alt={`Report ${index + 1}`}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-primary-200 pt-4 bg-primary-50 p-4 rounded-xl">
              <p className="text-sm text-secondary-600 font-medium mb-1">
                📅 Created: {new Date(report.createdAt).toLocaleString()}
              </p>
              {report.reporter && (
                <p className="text-sm text-secondary-600 font-medium">
                  👤 Reported by: <span className="font-semibold text-primary-600">{report.reporter.name}</span>
                </p>
              )}
            </div>

            {(isAdmin || isWorker) && (
              <div className="border-t border-primary-200 pt-6 space-y-4 bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl">
                <h2 className="text-xl font-bold text-secondary-800 flex items-center mb-4">
                  <span className="text-2xl mr-2">⚙️</span> Admin Actions
                </h2>
                
                {isAdmin && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        👷 Assign Team
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignTeam(e.target.value);
                          }
                        }}
                        value={report.assignedTeam?._id || ''}
                        className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white font-medium"
                      >
                        <option value="">Select a team</option>
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name} {team.members?.length ? `(${team.members.length} members)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        👤 Assign Worker(s)
                      </label>
                      <select
                        multiple
                        onChange={(e) => {
                          const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                          if (selectedIds.length > 0) {
                            handleAssignWorker(selectedIds);
                          }
                        }}
                        value={report.assignedTo?.map(w => w._id) || []}
                        className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white font-medium min-h-[100px]"
                      >
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.name} ({worker.email})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-secondary-500 mt-1">Hold Ctrl/Cmd to select multiple workers</p>
                      {report.assignedTo && report.assignedTo.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {report.assignedTo.map((worker) => (
                            <span key={worker._id} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                              {worker.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    📝 Update Status
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white mb-3 resize-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'assigned', 'in-progress', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        className="px-4 py-2 bg-white hover:bg-primary-50 text-secondary-700 border-2 border-primary-200 hover:border-primary-400 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {report.notes && report.notes.length > 0 && (
              <div className="border-t border-primary-200 pt-6">
                <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💬</span> Notes
                </h2>
                <div className="space-y-3">
                  {report.notes.map((note, index) => (
                    <div key={index} className="bg-gradient-to-r from-primary-50 to-white p-4 rounded-xl border border-primary-200 shadow-md hover:shadow-lg transition-all duration-300">
                      <p className="text-sm text-secondary-700 mb-2">{note.note}</p>
                      <p className="text-xs text-secondary-500 font-medium">
                        👤 {note.user?.name} - 📅 {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
