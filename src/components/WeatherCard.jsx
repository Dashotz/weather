import NearbyCities from './NearbyCities';

const WeatherCard = ({ weather, forecast, userLat, userLon, onCityClick }) => {
  if (!weather) return null;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getForecastItems = () => {
    if (!forecast || !forecast.daily) return [];
    
    // Open-Meteo format: daily data is in arrays (time, weather_code, temperature_2m_max, temperature_2m_min)
    const dailyForecasts = [];
    const maxDays = Math.min(5, forecast.daily.time.length);
    
    // Weather code mapping
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
      61: { main: 'Rain', description: 'slight rain', icon: '10d' },
      63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
      65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
      71: { main: 'Snow', description: 'slight snow fall', icon: '13d' },
      73: { main: 'Snow', description: 'moderate snow fall', icon: '13d' },
      75: { main: 'Snow', description: 'heavy snow fall', icon: '13d' },
      80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
      81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
      82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
      95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
      96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: '11d' },
      99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
    };
    
    for (let i = 0; i < maxDays; i++) {
      const time = forecast.daily.time[i];
      const weatherCode = forecast.daily.weather_code[i];
      const tempMax = forecast.daily.temperature_2m_max[i];
      const tempMin = forecast.daily.temperature_2m_min[i];
      const avgTemp = (tempMax + tempMin) / 2;
      
      const weatherInfo = weatherCodeMap[weatherCode] || { main: 'Clear', description: 'clear sky', icon: '01d' };
      
      dailyForecasts.push({
        dt: new Date(time).getTime() / 1000, // Convert to Unix timestamp
        main: {
          temp: avgTemp,
          temp_max: tempMax,
          temp_min: tempMin,
        },
        weather: [{
          main: weatherInfo.main,
          description: weatherInfo.description,
          icon: weatherInfo.icon,
        }],
      });
    }

    return dailyForecasts;
  };

  const currentTemp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind?.speed || 0;
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? weather.visibility.toFixed(1) : 'N/A';

  return (
    <div className="space-y-5 h-full flex flex-col animate-fadeIn">
      {/* Current Weather - 2 Column Layout */}
      <div className="flex gap-3 flex-shrink-0">
        {/* Left Column - Main Weather Card */}
        <div className="flex-1 relative overflow-hidden rounded-2xl bg-gray-700/50 p-6 text-white shadow-xl border border-gray-600/50">
          <div className="relative z-10 flex items-center gap-6 h-full">
            {/* Left Side - Location & Date */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-1">
                {weather.name}{weather.sys?.country && `, ${weather.sys.country}`}
              </h2>
              <p className="text-gray-300 text-sm">{formatDate(weather.dt)}</p>
            </div>
            
            {/* Middle - Condition with Icon */}
            <div className="flex items-center gap-3">
              <img
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={weather.weather[0].description}
                className="w-16 h-16"
              />
              <p className="text-base capitalize text-gray-200 font-medium">
                {weather.weather[0].description}
              </p>
            </div>
            
            {/* Right Side - Temperature */}
            <div className="flex flex-col ml-auto">
              <div className="text-5xl font-extrabold mb-1">{currentTemp}°C</div>
              <p className="text-gray-300 text-sm">Feels like {feelsLike}°C</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Weather Details 2x2 Grid */}
        <div className="w-48 grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all">
            <p className="text-xs text-blue-100 font-medium mb-1">Humidity</p>
            <p className="text-base font-bold text-white">{humidity}%</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all">
            <p className="text-xs text-green-100 font-medium mb-1">Wind</p>
            <p className="text-base font-bold text-white">{windSpeed} m/s</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all">
            <p className="text-[10px] text-purple-100 font-medium mb-0.5">Pressure</p>
            <p className="text-xs font-bold text-white">{pressure} hPa</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all">
            <p className="text-xs text-orange-100 font-medium mb-1">Visibility</p>
            <p className="text-base font-bold text-white">{visibility} km</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast - Enhanced Design */}
      {forecast && (
        <div className="flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span>5-Day Forecast</span>
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {getForecastItems().map((item, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded-xl p-3 text-center hover:bg-gray-700/70 transition-all hover:shadow-lg border border-gray-600/50"
              >
                <p className="text-xs font-bold text-gray-200 mb-1">
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <img
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <p className="text-xs text-gray-300 mb-1 capitalize truncate font-medium">
                  {item.weather[0].description}
                </p>
                <p className="text-base font-bold text-white">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Cities */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <NearbyCities 
          userLat={userLat} 
          userLon={userLon} 
          onCityClick={onCityClick}
        />
      </div>
    </div>
  );
};

export default WeatherCard;
