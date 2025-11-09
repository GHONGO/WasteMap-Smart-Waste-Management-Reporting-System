import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <div className="inline-block mb-6">
              <span className="text-7xl animate-bounce-slow">🗑️</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent mb-6 animate-slide-up">
              WasteMap
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-secondary-700 mb-4 animate-slide-up">
              Smart Waste Management & Reporting System
            </p>
            <p className="text-lg text-secondary-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Empower communities and municipalities to manage waste efficiently. 
              Report waste issues with photos and GPS locations, and track cleanup progress in real-time.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                <Link
                  to="/register"
                  className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-white hover:bg-primary-50 text-primary-600 border-2 border-primary-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                <Link
                  to="/map"
                  className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  📍 View Map
                </Link>
                <Link
                  to="/reports"
                  className="inline-block bg-white hover:bg-primary-50 text-primary-600 border-2 border-primary-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  📋 My Reports
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Features
          </span>
        </h2>
        <p className="text-center text-secondary-600 mb-12 text-lg">Everything you need for smart waste management</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📍</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Location Tagging
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Report waste issues with precise GPS coordinates for accurate location tracking.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Photo Upload
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Upload multiple photos to document waste sites and help cleanup teams identify issues.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔔</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Real-time Updates
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Get live status updates on your reports as cleanup teams work on resolving issues.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🗺️</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Interactive Map
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              View all waste reports on an interactive map to see hotspots and nearby issues.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Admins can access comprehensive analytics and performance metrics.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-100 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🚗</div>
            <h3 className="text-xl font-bold text-secondary-800 mb-3">
              Route Optimization
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Optimize cleanup routes for efficiency and faster response times.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Section */}
      <div className="bg-gradient-to-br from-primary-100 via-primary-50 to-white border-t border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              Supporting UN Sustainable Development Goals
            </span>
          </h2>
          <p className="text-center text-secondary-600 mb-12 text-lg">Contributing to a sustainable future</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary-200">
              <div className="text-6xl mb-4 animate-bounce-slow">🏙️</div>
              <h3 className="font-bold text-secondary-800 mb-2 text-xl">SDG 11</h3>
              <p className="text-secondary-600 font-medium">Sustainable Cities & Communities</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary-200">
              <div className="text-6xl mb-4 animate-bounce-slow">♻️</div>
              <h3 className="font-bold text-secondary-800 mb-2 text-xl">SDG 12</h3>
              <p className="text-secondary-600 font-medium">Responsible Consumption & Production</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary-200">
              <div className="text-6xl mb-4 animate-bounce-slow">🌍</div>
              <h3 className="font-bold text-secondary-800 mb-2 text-xl">SDG 13</h3>
              <p className="text-secondary-600 font-medium">Climate Action</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
