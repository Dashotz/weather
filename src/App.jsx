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
      // If no name provided, try to get it from reverse geocoding
      let cityName = name;
      let countryCode = '';
      if (!cityName) {
        const locationInfo = await reverseGeocode(lat, lon);
        cityName = locationInfo.name;
        countryCode = locationInfo.country;
      }
      
      const [currentWeatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, cityName, countryCode),
        getForecast(lat, lon),
      ]);
      
      setWeather(currentWeatherData);
      setForecast(forecastData);
      setPosition([lat, lon]);
      setCityName(cityName || currentWeatherData.name);
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
    <div className="h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden flex flex-col p-4">
      <div className="flex-shrink-0 mb-3">
        <header className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            Weather App
          </h1>
        </header>
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleCitySearch} onLocationClick={handleLocationSearch} />
        </div>
      </div>

        {error && (
          <div className="flex-shrink-0 max-w-2xl mx-auto mb-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="text-white mt-4 text-lg">Loading weather data...</p>
            </div>
          </div>
        )}

        {weather && !loading && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
            {/* Left Column: Weather & Temperatures */}
            <div className="overflow-hidden">
              <WeatherCard weather={weather} forecast={forecast} />
            </div>
            {/* Right Column: Map */}
            <div className="overflow-hidden">
              <div className="bg-white rounded-2xl shadow-xl p-4 h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Interactive Map</h2>
                <div className="flex-1 min-h-0">
                  <WeatherMap position={position} weather={weather} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-lg">
              Search for a city or click the location button to get started!
            </p>
          </div>
        )}
    </div>
  );
}

export default App;

