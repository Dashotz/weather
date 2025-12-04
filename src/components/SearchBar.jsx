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
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(city)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {city.name}, {city.country}
                  {city.state && `, ${city.state}`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onLocationClick}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Use current location"
        >
          📍
        </button>
        <button
          type="submit"
          disabled={isLoading || !query}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

