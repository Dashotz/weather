import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherMap from './components/WeatherMap';
import { getCurrentWeather, getForecast, reverseGeocode } from './services/weatherApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState('');

  const fetchWeatherData = async (lat, lon, name = '') => {
    setLoading(true);
    setError(null);
    try {
      // Fetch weather immediately, get city name in parallel or after
      const [currentWeatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, name, ''),
        getForecast(lat, lon),
      ]);
      
      setWeather(currentWeatherData);
      setForecast(forecastData);
      setPosition([lat, lon]);
      
      // Get city name asynchronously without blocking
      if (!name) {
        reverseGeocode(lat, lon).then(locationInfo => {
          if (locationInfo.name) {
            setCityName(locationInfo.name);
            // Update weather with city name if needed
            setWeather(prev => prev ? { ...prev, name: locationInfo.name, sys: { ...prev.sys, country: locationInfo.country } } : prev);
          } else {
            setCityName(currentWeatherData.name);
          }
        }).catch(() => {
          setCityName(currentWeatherData.name);
        });
      } else {
        setCityName(name || currentWeatherData.name);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          setError('Unable to retrieve your location. Please enable location permissions or search for a city.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleCitySearch = async (lat, lon, name) => {
    fetchWeatherData(lat, lon, name);
  };

  useEffect(() => {
    // Try to get user's location on mount
    handleLocationSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-y-auto lg:overflow-hidden lg:h-screen flex flex-col p-3 sm:p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-700/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="flex-shrink-0 mb-3 relative z-50">
        <header className="text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-2xl mb-1">
            Weather App
          </h1>
          <p className="text-xs sm:text-sm text-white/80">Your weather companion</p>
        </header>
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleCitySearch} onLocationClick={handleLocationSearch} />
        </div>
      </div>

        {error && (
          <div className="flex-shrink-0 max-w-2xl mx-auto mb-2 glass-strong rounded-xl shadow-lg text-red-700 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-red-200 relative z-10 animate-fadeIn">
            <p className="font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>Error:</span>
            </p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center relative z-10 min-h-[50vh]">
            <div className="text-center glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-white border-t-transparent"></div>
              <p className="text-gray-800 mt-4 sm:mt-6 text-base sm:text-lg font-semibold">Loading weather data...</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">Please wait a moment</p>
            </div>
          </div>
        )}

        {weather && !loading && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:overflow-hidden lg:min-h-0">
            {/* Left Column: Weather & Temperatures */}
            <div className="lg:overflow-hidden flex flex-col relative z-10">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-5 lg:h-full flex flex-col lg:overflow-y-auto border border-gray-700/50">
                <WeatherCard 
                  weather={weather} 
                  forecast={forecast}
                  userLat={position?.[0]}
                  userLon={position?.[1]}
                  onCityClick={handleCitySearch}
                />
              </div>
            </div>
            {/* Right Column: Map */}
            <div className="lg:overflow-hidden flex flex-col relative z-10">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-5 lg:h-full flex flex-col border border-gray-700/50">
                <h2 className="text-lg sm:text-xl font-bold text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🗺️</span>
                  <span>Interactive Map</span>
                </h2>
                <div className="flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
                  <WeatherMap position={position} weather={weather} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="flex-1 flex items-center justify-center relative z-10 min-h-[50vh]">
            <div className="text-center glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md mx-4">
              <div className="text-5xl sm:text-6xl mb-4">🌤️</div>
              <p className="text-gray-800 text-lg sm:text-xl font-bold mb-2">
                Welcome to Weather App
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                Search for a city or click the location button to get started!
              </p>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;

