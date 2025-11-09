import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ReportCard = ({ report }) => {
  const { isAdmin, isWorker } = useAuth();

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

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <Link
      to={`/reports/${report._id}`}
      className="block bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-6 border border-primary-100 group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-secondary-800 truncate flex-1 group-hover:text-primary-600 transition-colors">
          {report.description.substring(0, 60)}
          {report.description.length > 60 && '...'}
        </h3>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${getStatusColor(
            report.status
          )}`}
        >
          {report.status}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        {report.address && (
          <p className="truncate">
            📍 {report.address}
          </p>
        )}
        <p>
          Priority:{' '}
          <span className={`font-medium ${getPriorityColor(report.priority)}`}>
            {report.priority}
          </span>
        </p>
        {(isAdmin || isWorker) && report.reporter && (
          <p>Reported by: {report.reporter.name}</p>
        )}
      </div>

      {report.images && report.images.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img
            src={report.images[0].url}
            alt="Report"
            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-secondary-500 pt-3 border-t border-primary-100">
        <span className="font-medium">📅 {new Date(report.createdAt).toLocaleDateString()}</span>
        {(isAdmin || isWorker) && report.assignedTeam && (
          <span className="font-semibold text-primary-600">👷 Team: {report.assignedTeam.name}</span>
        )}
      </div>
    </Link>
  );
};

export default ReportCard;
