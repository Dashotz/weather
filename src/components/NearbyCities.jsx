import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/weatherApi';
import { getWeatherIcon } from '../utils/weatherUtils';

const NearbyCities = ({ userLat, userLon, onCityClick }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded list of Philippine cities for better accuracy
  const philippineCities = [
    // Metro Manila
    { name: 'Manila', lat: 14.5995, lon: 120.9842, country: 'PH' },
    { name: 'Quezon City', lat: 14.6760, lon: 121.0437, country: 'PH' },
    { name: 'Makati', lat: 14.5547, lon: 121.0244, country: 'PH' },
    { name: 'Pasig', lat: 14.5764, lon: 121.0851, country: 'PH' },
    { name: 'Taguig', lat: 14.5176, lon: 121.0509, country: 'PH' },
    { name: 'Mandaluyong', lat: 14.5794, lon: 121.0359, country: 'PH' },
    { name: 'Pasay', lat: 14.5378, lon: 120.9969, country: 'PH' },
    { name: 'Marikina', lat: 14.6507, lon: 121.1029, country: 'PH' },
    { name: 'Las Piñas', lat: 14.4500, lon: 120.9833, country: 'PH' },
    { name: 'Parañaque', lat: 14.4793, lon: 121.0198, country: 'PH' },
    { name: 'Valenzuela', lat: 14.7000, lon: 120.9833, country: 'PH' },
    { name: 'Caloocan', lat: 14.6548, lon: 120.9847, country: 'PH' },
    { name: 'Muntinlupa', lat: 14.4081, lon: 121.0415, country: 'PH' },
    { name: 'San Juan', lat: 14.6019, lon: 121.0285, country: 'PH' },
    
    // Nearby provinces
    { name: 'Antipolo', lat: 14.5886, lon: 121.1753, country: 'PH' },
    { name: 'Cavite City', lat: 14.4793, lon: 120.8970, country: 'PH' },
    { name: 'Bacoor', lat: 14.4594, lon: 120.9250, country: 'PH' },
    { name: 'Imus', lat: 14.4297, lon: 120.9367, country: 'PH' },
    { name: 'Dasmariñas', lat: 14.3294, lon: 120.9367, country: 'PH' },
    { name: 'Tagaytay', lat: 14.0969, lon: 120.9330, country: 'PH' },
    { name: 'Calamba', lat: 14.2117, lon: 121.1653, country: 'PH' },
    { name: 'Los Baños', lat: 14.1667, lon: 121.2333, country: 'PH' },
    { name: 'San Pedro', lat: 14.3589, lon: 121.0567, country: 'PH' },
    
    // Northern Luzon
    { name: 'Baguio', lat: 16.4023, lon: 120.5960, country: 'PH' },
    { name: 'Dagupan', lat: 16.0431, lon: 120.3331, country: 'PH' },
    { name: 'Tarlac City', lat: 15.4800, lon: 120.6000, country: 'PH' },
    { name: 'Olongapo', lat: 14.8292, lon: 120.2828, country: 'PH' },
    { name: 'Angeles', lat: 15.1472, lon: 120.5847, country: 'PH' },
    
    // Central Visayas
    { name: 'Cebu City', lat: 10.3157, lon: 123.8854, country: 'PH' },
    { name: 'Mandaue', lat: 10.3236, lon: 123.9222, country: 'PH' },
    { name: 'Lapu-Lapu', lat: 10.3103, lon: 123.9494, country: 'PH' },
    { name: 'Talisay', lat: 10.2447, lon: 123.8497, country: 'PH' },
    
    // Western Visayas
    { name: 'Iloilo City', lat: 10.7202, lon: 122.5621, country: 'PH' },
    { name: 'Bacolod', lat: 10.6765, lon: 122.9509, country: 'PH' },
    
    // Mindanao
    { name: 'Davao City', lat: 7.1907, lon: 125.4553, country: 'PH' },
    { name: 'Cagayan de Oro', lat: 8.4542, lon: 124.6319, country: 'PH' },
    { name: 'Zamboanga City', lat: 6.9214, lon: 122.0790, country: 'PH' },
    { name: 'General Santos', lat: 6.1128, lon: 125.1717, country: 'PH' },
    { name: 'Butuan', lat: 8.9492, lon: 125.5436, country: 'PH' },
    
    // Bicol
    { name: 'Naga', lat: 13.6192, lon: 123.1814, country: 'PH' },
    { name: 'Legazpi', lat: 13.1394, lon: 123.7444, country: 'PH' },
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get nearby cities based on user location
  const getNearbyCities = (lat, lon) => {
    if (!lat || !lon) {
      // No location, return major cities
      return philippineCities.slice(0, 4);
    }

    // Calculate distance for all cities
    const citiesWithDistance = philippineCities.map(city => ({
      ...city,
      distance: calculateDistance(lat, lon, city.lat, city.lon)
    }));

    // Filter cities within 150km and sort by distance
    const nearbyCities = citiesWithDistance
      .filter(city => city.distance <= 150)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
    
    // If we have less than 4 cities within 150km, fill with closest cities overall
    if (nearbyCities.length < 4) {
      const closestCities = citiesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
      
      // Merge and remove duplicates
      const merged = [...nearbyCities];
      const names = new Set(nearbyCities.map(c => c.name));
      
      closestCities.forEach(city => {
        if (!names.has(city.name) && merged.length < 4) {
          merged.push(city);
          names.add(city.name);
        }
      });
      
      return merged;
    }
    
    return nearbyCities;
  };

  useEffect(() => {
    const fetchCitiesWeather = async () => {
      setLoading(true);
      try {
        const citiesToShow = getNearbyCities(userLat, userLon);
        
        // Load 4 cities
        const citiesToLoad = citiesToShow.slice(0, 4);
        
        // Fetch weather in parallel - Open-Meteo can handle multiple requests efficiently
        // No sequential delays = much faster loading (was 2.4s+, now ~0.5s)
        const weatherPromises = citiesToLoad.map(city =>
          getCurrentWeather(city.lat, city.lon, city.name, city.country)
            .then(weather => ({ ...city, weather }))
            .catch(() => null)
        );
        
        const results = await Promise.all(weatherPromises);
        const validResults = results.filter(item => item !== null && item.weather);
        setCities(validResults);
      } catch (error) {
        console.error('Error fetching cities weather:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesWeather();
  }, [userLat, userLon]);

  if (loading) {
    return (
      <div className="mt-3 sm:mt-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🌍</span>
          <span>Nearby Cities</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-700/50 rounded-lg sm:rounded-xl p-2 sm:p-4 animate-pulse border border-gray-600/50">
              <div className="h-3 sm:h-4 bg-gray-600 rounded w-3/4 mb-2 sm:mb-3"></div>
              <div className="h-5 sm:h-6 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 sm:mt-4">
      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-xl sm:text-2xl">🌍</span>
        <span>Nearby Cities</span>
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 overflow-hidden">
        {cities.map((city, index) => (
          <button
            key={index}
            onClick={() => onCityClick(city.lat, city.lon, city.name)}
            className="group bg-gray-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-left hover:bg-gray-700/70 transition-all border border-gray-600/50 hover:border-blue-700/50 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                  {city.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5">
                  <span className="font-medium">Philippines</span>
                  {city.distance && (
                    <span className="ml-1 text-gray-400">• {Math.round(city.distance)}km</span>
                  )}
                </p>
              </div>
              {city.weather && (
                <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                  <img
                    src={getWeatherIcon(city.weather.weather[0].icon)}
                    alt={city.weather.weather[0].description}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
                    {Math.round(city.weather.main.temp)}°C
                  </span>
                </div>
              )}
            </div>
            {city.weather && (
              <p className="text-[10px] sm:text-xs text-gray-300 capitalize mt-1 sm:mt-2 truncate font-medium">
                {city.weather.weather[0].description}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NearbyCities;
