# Weather App

A beautiful weather application with location-based forecasts and interactive maps.

## 🌟 Features

- 🌍 **Location-based forecasts** - Get weather data based on your current location or search for any city
- 🗺️ **Interactive maps** - Visualize weather locations using Leaflet maps with clickable markers
- 📊 **5-day forecast** - View detailed weather predictions for the next 5 days
- 🏙️ **Nearby cities** - See weather for nearby cities with one-click navigation
- 🔍 **City search** - Search and select cities from around the world with autocomplete
- 📱 **Responsive design** - Beautiful UI that works perfectly on all devices
- ⚡ **Fast & efficient** - Optimized loading with parallel API requests
- 🆓 **100% Free** - No API keys required! Uses free and open-source APIs

## 🛠️ Technologies Used

- **React** - Modern UI framework for building interactive user interfaces
- **Leaflet** & **React-Leaflet** - Interactive maps for location visualization
- **Open-Meteo API** - Free, open-source weather data (no API key needed)
- **Nominatim (OpenStreetMap)** - Free geocoding service for city search
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Next-generation frontend build tool for fast development

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

**No API keys needed!** This app uses completely free services.

### Installation

1. Clone or navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

That's it! No configuration needed.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

1. **Get current location weather**: Click the location button (📍) to use your browser's geolocation
2. **Search for a city**: Type in the search bar to find cities with autocomplete suggestions
3. **View forecast**: See detailed weather information including:
   - Current temperature and conditions
   - Weather details (humidity, wind speed, pressure, visibility)
   - 5-day forecast with daily predictions
4. **Explore nearby cities**: Browse weather for 6 nearby cities
5. **Interactive map**: View the location on an interactive map with weather details in the popup

## 🌐 APIs Used

This application uses completely free services:

- **[Open-Meteo](https://open-meteo.com/)** - Free, open-source weather API with no API key required. Provides accurate weather forecasts using data from national weather services.
- **[Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/)** - Free geocoding service for converting city names to coordinates and reverse geocoding.

Both services are free for non-commercial use and don't require registration or API keys.

## 📁 Project Structure

```
weather/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx      # City search with autocomplete
│   │   ├── WeatherCard.jsx    # Main weather display card with forecast
│   │   ├── WeatherMap.jsx     # Interactive Leaflet map
│   │   └── NearbyCities.jsx   # Nearby cities weather widget
│   ├── services/
│   │   └── weatherApi.js      # Open-Meteo & Nominatim API integration
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Design Features

- **Two-column layout** - Weather information on the left, interactive map on the right
- **Compact design** - Fits perfectly in a single viewport without scrolling
- **Smooth animations** - Clean transitions and hover effects
- **Hidden scrollbar** - Clean aesthetic with functional scrolling
- **Responsive grid** - Adapts beautifully to different screen sizes

## ⚡ Performance Optimizations

- Parallel API requests for faster loading
- Non-blocking reverse geocoding
- Optimized city loading (6 nearby cities)
- Efficient data fetching patterns
- Clean, minimal codebase

## 📝 License

MIT
