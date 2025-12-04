# Weather App

A beautiful, modern weather application built with React that provides location-based weather forecasts and interactive maps.

## Features

- 🌍 **Location-based forecasts** - Get weather data based on your current location or search for any city
- 🗺️ **Interactive maps** - Visualize weather locations using Leaflet maps
- 📊 **5-day forecast** - View detailed weather predictions for the next 5 days
- 🔍 **City search** - Search and select cities from around the world with autocomplete
- 📱 **Responsive design** - Beautiful UI that works on all devices
- ⚡ **Fast & modern** - Built with Vite and React for optimal performance
- 🆓 **100% Free** - No API keys required! Uses free and open-source APIs

## Technologies Used

- **React** - UI framework
- **Leaflet** & **React-Leaflet** - Interactive maps
- **Open-Meteo API** - Free, open-source weather data (no API key needed)
- **Nominatim (OpenStreetMap)** - Free geocoding service for city search
- **Tailwind CSS** - Modern styling
- **Vite** - Fast build tool

## Getting Started

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

## Usage

1. **Get current location weather**: Click the location button (📍) to use your browser's geolocation
2. **Search for a city**: Type in the search bar to find cities with autocomplete suggestions
3. **View forecast**: See detailed weather information and a 5-day forecast
4. **Explore on map**: Click on the interactive map to see the location visually

## APIs Used

This application uses completely free services:

- **[Open-Meteo](https://open-meteo.com/)** - Free, open-source weather API with no API key required. Provides accurate weather forecasts using data from national weather services.
- **[Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/)** - Free geocoding service for converting city names to coordinates.

Both services are free for non-commercial use and don't require registration or API keys.

## Project Structure

```
weather/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx      # City search with autocomplete
│   │   ├── WeatherCard.jsx    # Main weather display card
│   │   └── WeatherMap.jsx     # Interactive Leaflet map
│   ├── services/
│   │   └── weatherApi.js      # Open-Meteo & Nominatim API integration
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## License

MIT
