import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import MovieDetails from "./components/MovieDetails";
import { Link } from "react-router-dom";

function App() {
  const [movies, setMovies] = useState([]);
  const location = useLocation();

  // NEW STATES
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  //darkmood
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === null ? true : stored === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  if (!movies) {
    return <div className="spinner"> </div>;
  }

  const API_KEY = "b93b3ba2ce54ca4078522217cbe877ce";

  const fetchMovies = async (query, page = 1) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

    const response = await fetch(url);
    const data = await response.json();

    setMovies(data.results);
  };

  // Fetch popular movies on initial load
  useEffect(() => {
    const fetchPopularMovies = async () => {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;

      const response = await fetch(url);
      const data = await response.json();
      setIsSearching(false);

      setMovies(data.results);
    };

    // ONLY fetch popular if no search query
    if (!searchQuery) {
      fetchPopularMovies();
    }
  }, [page, searchQuery]);

  // Handle Search
  const handleSearch = (query) => {
    setIsSearching(true);
    setSearchQuery(query);
    setPage(1);
    fetchMovies(query, 1);
  };

  //darkmood
  useEffect(() => {
    document.body.className = darkMode ? "dark-body" : "light-body";
  }, [darkMode]);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h1>TheMovieMap</h1>
      </Link>

      <button className="mode-btn" onClick={toggleDarkMode}>
        <span className={darkMode ? "icon moon" : "icon sun"}></span>
      </button>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              movies={movies}
              onSearch={handleSearch}
              page={page}
              setPage={setPage}
              searchQuery={searchQuery}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>

      {/* Pagination Controls */}
      {location.pathname === "/" && !isSearching && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
