import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ReportForm = ({ onSubmit, onCancel, initialLocation }) => {
  const [formData, setFormData] = useState({
    description: '',
    latitude: initialLocation?.lat || '',
    longitude: initialLocation?.lng || '',
    address: '',
    priority: 'medium',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [locationMethod, setLocationMethod] = useState(initialLocation ? 'map' : 'address'); // 'address' or 'map'

  useEffect(() => {
    if (initialLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
      }));
      setLocationMethod('map');
      // Reverse geocode to get address
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation]);

  // Update location when initialLocation changes (e.g., user clicks map while form is open)
  useEffect(() => {
    if (initialLocation && locationMethod === 'map') {
      setFormData(prev => ({
        ...prev,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
      }));
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    }
  }, [initialLocation, locationMethod]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WasteMap App'
          }
        }
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name,
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const geocodeAddress = async (address) => {
    if (!address || address.trim() === '') return;
    
    setGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=ke`,
        {
          headers: {
            'User-Agent': 'WasteMap App'
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));
        toast.success('📍 Location found on map!');
      } else {
        toast.error('Address not found. Please try a different address or use map pinning.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      toast.error('Failed to find location. Please try again or use map pinning.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressBlur = () => {
    if (locationMethod === 'address' && formData.address) {
      geocodeAddress(formData.address);
    }
  };

  const handleLocationMethodChange = (method) => {
    setLocationMethod(method);
    if (method === 'map' && initialLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
      }));
    } else if (method === 'address') {
      setFormData(prev => ({
        ...prev,
        latitude: '',
        longitude: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      setFormData({
        ...formData,
        images: [...formData.images, ...base64Images],
      });
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description) {
      toast.error('Please provide a description');
      return;
    }

    // Validate location: either address OR coordinates must be provided
    if (locationMethod === 'address') {
      if (!formData.address || formData.address.trim() === '') {
        toast.error('Please enter an address or use map pinning');
        return;
      }
      // If address provided but no coordinates, try to geocode
      if (!formData.latitude || !formData.longitude) {
        await geocodeAddress(formData.address);
        // Wait a bit for geocoding to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!formData.latitude || !formData.longitude) {
          toast.error('Could not find location for this address. Please try a different address or use map pinning.');
          return;
        }
      }
    } else if (locationMethod === 'map') {
      if (!formData.latitude || !formData.longitude) {
        toast.error('Please select a location on the map or enter an address');
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success('Report submitted successfully!');
      setFormData({
        description: '',
        latitude: '',
        longitude: '',
        address: '',
        priority: 'medium',
        images: [],
      });
      setLocationMethod('address');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-6 rounded-xl">
      <div className="mb-6">
        <div className="text-4xl mb-3">🗑️</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
          Report Waste Issue
        </h2>
        <p className="text-secondary-600 text-sm">Fill in the details below to report a waste problem</p>
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-semibold text-secondary-700 mb-2">
          📝 Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white resize-none"
          placeholder="Describe the waste issue in detail..."
        />
      </div>

      {/* Location Method Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-secondary-700 mb-3">
          📍 Location *
        </label>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => handleLocationMethodChange('address')}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              locationMethod === 'address'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            🏠 Enter Address
          </button>
          <button
            type="button"
            onClick={() => handleLocationMethodChange('map')}
            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              locationMethod === 'map'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            📌 Pin on Map
          </button>
        </div>

        {locationMethod === 'address' ? (
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleAddressBlur}
              required
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
              placeholder="Enter address (e.g., Nairobi, Kenya or specific street address)"
            />
            {geocoding && (
              <p className="text-sm text-primary-600 mt-2">🔍 Finding location...</p>
            )}
            {formData.latitude && formData.longitude && (
              <p className="text-sm text-green-600 mt-2">
                ✅ Location found: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 mb-3">
              <p className="text-sm text-secondary-700 mb-2">
                📌 <strong>Click on the map</strong> to select the location of the waste issue.
              </p>
              {formData.latitude && formData.longitude ? (
                <p className="text-sm text-green-600">
                  ✅ Location selected: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                </p>
              ) : (
                <p className="text-sm text-yellow-600">
                  ⚠️ Please click on the map to select a location
                </p>
              )}
            </div>
            {formData.address && (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white"
                placeholder="Address (auto-filled from map location)"
                readOnly
              />
            )}
            {/* Hidden inputs for coordinates */}
            <input type="hidden" name="latitude" value={formData.latitude} />
            <input type="hidden" name="longitude" value={formData.longitude} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-secondary-700 mb-2">
          🎯 Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white font-medium"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-secondary-700 mb-2">
          📸 Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full px-4 py-3 border-2 border-dashed border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-primary-50 hover:bg-primary-100 cursor-pointer"
        />
        {formData.images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} alt={`Preview ${index}`} className="w-full h-28 object-cover rounded-xl shadow-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg transform hover:scale-110 transition-all duration-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-primary-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            ❌ Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⏳</span>
              Submitting...
            </span>
          ) : (
            '🚀 Submit Report'
          )}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
