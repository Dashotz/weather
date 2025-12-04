import { useState } from 'react';

const SearchBar = ({ onSearch, onLocationClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setIsLoading(true);
      try {
        const { searchCity } = await import('../services/weatherApi');
        const results = await searchCity(value);
        setSuggestions(results);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(`${city.name}, ${city.country}`);
    setSuggestions([]);
    onSearch(city.lat, city.lon, city.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto animate-fadeIn">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for a city..."
              className="w-full px-4 py-3 pl-10 rounded-xl glass-strong shadow-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:shadow-xl transition-all"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-20 w-full mt-2 glass-strong rounded-xl shadow-2xl max-h-60 overflow-y-auto border border-white/30 animate-fadeIn">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(city)}
                  className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-800">{city.name}</span>
                  <span className="text-gray-600">, {city.country}</span>
                  {city.state && <span className="text-gray-500">, {city.state}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onLocationClick}
          className="px-4 py-3 glass-strong hover:bg-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          title="Use current location"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading || !query}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 backdrop-blur-md border border-white/30"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

