import React from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import MovieCard from "../components/MovieCard";

const Home = ({ movies, onSearch, page, setPage, searchQuery }) => {
  return (
    <div>
      <SearchBar onSearch={onSearch} />
      <MovieList movies={movies} />
      

     
    </div>
  );
};

export default Home;
