// Open-Meteo API - Free, no API key required
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
// Nominatim (OpenStreetMap) - Free geocoding API
const GEOCODING_BASE_URL = 'https://nominatim.openstreetmap.org';

export const getCurrentWeather = async (lat, lon, cityName = '', countryCode = '') => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    if (!response.ok) throw new Error('Failed to fetch current weather');
    const data = await response.json();
    
    // Transform Open-Meteo format to match our component expectations
    return transformWeatherData(data, lat, lon, cityName, countryCode);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
    );
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const searchCity = async (query) => {
  try {
    const response = await fetch(
      `${GEOCODING_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
    );
    if (!response.ok) throw new Error('Failed to search city');
    const data = await response.json();
    
    // Transform Nominatim format to match our expectations
    return data.map(item => ({
      name: item.address.city || item.address.town || item.address.village || item.address.municipality || item.name,
      country: item.address.country,
      state: item.address.state,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    // Add a small delay to respect Nominatim's rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `${GEOCODING_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    );
    if (!response.ok) throw new Error('Failed to reverse geocode');
    const data = await response.json();
    
    if (!data || !data.address) {
      return { name: '', country: '' };
    }
    
    const address = data.address;
    return {
      name: address.city || address.town || address.village || address.municipality || address.county || '',
      country: address.country_code?.toUpperCase() || ''
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return { name: '', country: '' };
  }
};

export const getWeatherByCity = async (cityName) => {
  try {
    // First, get coordinates from city name
    const cities = await searchCity(cityName);
    if (cities.length === 0) {
      throw new Error('City not found');
    }
    
    const city = cities[0];
    const weather = await getCurrentWeather(city.lat, city.lon, city.name, city.country || '');
    
    return {
      weather,
      coords: { lat: city.lat, lon: city.lon }
    };
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

// Helper function to transform Open-Meteo data to match OpenWeather format
const transformWeatherData = (data, lat, lon, cityName, countryCode = '') => {
  const current = data.current;
  const daily = data.daily;
  
  // Weather code mapping (WMO Weather interpretation codes)
  const weatherCodeMap = {
    0: { main: 'Clear', description: 'clear sky', icon: '01d' },
    1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'overcast', icon: '04d' },
    45: { main: 'Fog', description: 'foggy', icon: '50d' },
    48: { main: 'Fog', description: 'depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
    56: { main: 'Drizzle', description: 'light freezing drizzle', icon: '09d' },
    57: { main: 'Drizzle', description: 'dense freezing drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
    66: { main: 'Rain', description: 'light freezing rain', icon: '10d' },
    67: { main: 'Rain', description: 'heavy freezing rain', icon: '10d' },
    71: { main: 'Snow', description: 'slight snow fall', icon: '13d' },
    73: { main: 'Snow', description: 'moderate snow fall', icon: '13d' },
    75: { main: 'Snow', description: 'heavy snow fall', icon: '13d' },
    77: { main: 'Snow', description: 'snow grains', icon: '13d' },
    80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
  };
  
  const weatherCode = current.weather_code;
  const weatherInfo = weatherCodeMap[weatherCode] || { main: 'Clear', description: 'clear sky', icon: '01d' };
  
  return {
    coord: { lat, lon },
    weather: [{
      main: weatherInfo.main,
      description: weatherInfo.description,
      icon: weatherInfo.icon
    }],
    base: 'stations',
    main: {
      temp: current.temperature_2m,
      feels_like: current.temperature_2m, // Open-Meteo doesn't provide feels_like, using temp
      temp_min: daily.temperature_2m_min[0],
      temp_max: daily.temperature_2m_max[0],
      pressure: Math.round(current.pressure_msl),
      humidity: current.relative_humidity_2m,
    },
    visibility: current.visibility ? Math.round(current.visibility / 1000) : 10000,
    wind: {
      speed: current.wind_speed_10m,
      deg: 0 // Open-Meteo doesn't provide wind direction in current
    },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: countryCode,
      sunrise: 0,
      sunset: 0
    },
    timezone: data.timezone || 0,
    id: 0,
    name: cityName || 'Unknown Location',
  };
};
