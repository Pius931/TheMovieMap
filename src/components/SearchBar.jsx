import React from "react";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      setError("Please type in a movie to search");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    onSearch(query);
    setQuery("");
  };

  return (
    <div>
      <div className="search-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search Movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SearchBar;
