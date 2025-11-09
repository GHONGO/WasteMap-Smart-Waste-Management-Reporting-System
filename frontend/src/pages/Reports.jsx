import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';
import { reportService } from '../services/reportService';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const socket = useSocket();

  useEffect(() => {
    loadReports();
    
    if (socket) {
      socket.on('new-report', (newReport) => {
        if (user?.role === 'citizen' && newReport.reporter._id === user._id) {
          setReports((prev) => [newReport, ...prev]);
        } else if (user?.role !== 'citizen') {
          setReports((prev) => [newReport, ...prev]);
        }
      });

      socket.on('report-updated', (updatedReport) => {
        setReports((prev) =>
          prev.map((r) => (r._id === updatedReport._id ? updatedReport : r))
        );
      });

      return () => {
        socket.off('new-report');
        socket.off('report-updated');
      };
    }
  }, [socket, user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(filters);
      setReports(data.reports || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">📋</div>
          <div className="text-primary-600 font-semibold text-lg">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
            📋 My Reports
          </h1>
          <p className="text-secondary-600 text-lg mb-6">View and manage all your waste reports</p>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary-200 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                📊 Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-4 py-2.5 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white font-medium"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                🎯 Priority
              </label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="px-4 py-2.5 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white font-medium"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-primary-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-secondary-600 text-lg font-semibold">No reports found</p>
            <p className="text-secondary-500 mt-2">Start reporting waste issues to see them here!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
