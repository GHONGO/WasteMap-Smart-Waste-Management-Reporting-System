import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import ReportForm from '../components/ReportForm';
import { reportService } from '../services/reportService';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center] = useState([-1.2921, 36.8219]); // Default to Nairobi, Kenya
  const socket = useSocket();

  useEffect(() => {
    loadReports();
    
    if (socket) {
      socket.on('new-report', (newReport) => {
        setReports((prev) => [newReport, ...prev]);
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
  }, [socket]);

  const loadReports = async () => {
    try {
      const data = await reportService.getReports({ limit: 100 });
      setReports(data.reports || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    setTempMarker(latlng);
    if (showForm) {
      // If form is already open, update the location
      // This will trigger the useEffect in ReportForm
    } else {
      setShowForm(true);
    }
  };

  const handleSubmitReport = async (formData) => {
    // Ensure we have coordinates (either from form or selected location)
    const finalLat = formData.latitude || selectedLocation?.lat;
    const finalLng = formData.longitude || selectedLocation?.lng;
    
    if (!finalLat || !finalLng) {
      toast.error('Please select a location on the map or enter a valid address');
      return;
    }

    await reportService.createReport({
      ...formData,
      latitude: finalLat,
      longitude: finalLng,
    });
    setShowForm(false);
    setSelectedLocation(null);
    setTempMarker(null);
    loadReports();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'red',
      assigned: 'blue',
      'in-progress': 'orange',
      completed: 'green',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🗺️</div>
          <div className="text-primary-600 font-semibold text-lg">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-primary-200">
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setSelectedLocation(null);
              setTempMarker(null);
            }
          }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {showForm ? '❌ Cancel' : '📝 Report Waste Issue'}
        </button>
      </div>

      {showForm && (
        <div className="absolute top-20 left-4 z-[1000] w-96 max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-primary-200">
          <ReportForm
            onSubmit={handleSubmitReport}
            onCancel={() => {
              setShowForm(false);
              setSelectedLocation(null);
              setTempMarker(null);
            }}
            initialLocation={tempMarker || selectedLocation}
          />
        </div>
      )}

      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleLocationSelect} />
        
        {/* Temporary marker for selected location */}
        {tempMarker && showForm && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <div className="p-2">
                <p className="text-sm font-semibold text-red-600">📍 Selected Location</p>
                <p className="text-xs text-gray-600">
                  {tempMarker.lat.toFixed(4)}, {tempMarker.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.location.coordinates[1], report.location.coordinates[0]]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {report.description.substring(0, 50)}
                  {report.description.length > 50 && '...'}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-medium text-${getStatusColor(report.status)}-600`}>{report.status}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
