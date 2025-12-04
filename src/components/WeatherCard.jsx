const WeatherCard = ({ weather, forecast }) => {
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
    <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4 h-full">
      {/* Current Weather - Compact Horizontal Layout */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">
            {weather.name}{weather.sys?.country && `, ${weather.sys.country}`}
          </h2>
          <p className="text-sm text-gray-600">{formatDate(weather.dt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-16 h-16"
          />
          <div>
            <div className="text-4xl font-bold text-gray-800">{currentTemp}°C</div>
            <p className="text-sm text-gray-500">Feels like {feelsLike}°C</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm capitalize text-gray-600">
            {weather.weather[0].description}
          </p>
        </div>
      </div>

      {/* Weather Details Grid - Horizontal */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Humidity</p>
          <p className="text-xl font-bold text-blue-600">{humidity}%</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Wind</p>
          <p className="text-xl font-bold text-green-600">{windSpeed} m/s</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Pressure</p>
          <p className="text-xl font-bold text-purple-600">{pressure} hPa</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Visibility</p>
          <p className="text-xl font-bold text-orange-600">{visibility} km</p>
        </div>
      </div>

      {/* 5-Day Forecast - Horizontal Layout */}
      {forecast && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {getForecastItems().map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <img
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className="w-10 h-10 mx-auto mb-2"
                />
                <p className="text-xs text-gray-600 mb-1 capitalize truncate">
                  {item.weather[0].description}
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
