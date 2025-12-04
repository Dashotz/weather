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
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map will appear when location is selected</p>
      </div>
    );
  }

  const [lat, lon] = position;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
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
            <div className="text-center">
              {weather && (
                <>
                  <p className="font-bold text-lg">{weather.name}</p>
                  <p className="text-base font-semibold text-blue-600">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-sm capitalize text-gray-600">
                    {weather.weather[0].description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind: {weather.wind?.speed || 0} m/s</p>
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

