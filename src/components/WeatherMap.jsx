import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const WeatherMap = ({ position, weather, zoom = 10 }) => {
  if (!position) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-gray-600 font-medium">Map will appear when location is selected</p>
        </div>
      </div>
    );
  }

  const [lat, lon] = position;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner">
      <MapContainer
        center={[lat, lon]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapUpdater center={[lat, lon]} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            <div className="text-center p-2">
              {weather && (
                <>
                  <p className="font-bold text-lg text-gray-800">{weather.name}</p>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      className="w-10 h-10"
                    />
                    <p className="text-xl font-bold text-blue-600">
                      {Math.round(weather.main.temp)}°C
                    </p>
                  </div>
                  <p className="text-sm capitalize text-gray-600 font-medium">
                    {weather.weather[0].description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                    <p>💧 Humidity: {weather.main.humidity}%</p>
                    <p>💨 Wind: {weather.wind?.speed || 0} m/s</p>
                  </div>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;

