import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const API_KEY = "b93b3ba2ce54ca4078522217cbe877ce";
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      setMovie(data);

      // Fetch Trailer
      const trailerUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
      const trailerResponse = await fetch(trailerUrl);
      const trailerData = await trailerResponse.json();

      // find official YouTube trailer
      const officialTrailer = trailerData.results.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.official === true,
      );

      // fallback to first YouTube video if no official trailer
      const trailer =
        officialTrailer ||
        trailerData.results.find((video) => video.site === "YouTube");

      if (trailer) {
        setTrailerKey(trailer.key);
      }

      // Fetch Watch Providers
      const fetchWatchProviders = async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`,
          );
          const data = await res.json();

          // Pick a country (USA)
          const country = data.results?.US;

          if (country?.flatrate) {
            setProviders(country.flatrate);
          } else {
            setProviders([]);
          }
        } catch (error) {
          console.error("Failed to fetch watch providers", error);
        }
      };
      fetchWatchProviders();
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div className="spinner"> </div>;
  }

  return (
    <div className="movie-details">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="details-container">
        <img
          className="details-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title}
        />

        <div className="details-info">
          <h2>{movie.title}</h2>
          <p className="details-overview">{movie.overview}</p>

          <div className="details-meta">
            <span>Release: {movie.release_date}</span>
            <span>Rating: {movie.vote_average.toFixed(1)}/10</span>
            <span>Runtime: {movie.runtime} mins</span>
            <span>
              Genre: {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/**Trailer embedding */}
      {trailerKey && (
        <div className="trailer">
          <h3>Trailer</h3>
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/**Watch Providers */}
      {providers.length > 0 && (
        <div className="watch-providers">
          <h3>Where to Watch</h3>

          <div className="providers-list">
            {providers.map((provider) => (
              <div key={provider.provider_id} className="provider">
                <img
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
