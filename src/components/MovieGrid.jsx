import MovieCard from './MovieCard';

export default function MovieGrid({ movies, label }) {
  return (
    <ul className="movie-grid" aria-label={label}>
      {movies.map((m) => (
        <li key={m.id}>
          <MovieCard movie={m} />
        </li>
      ))}
    </ul>
  );
}
