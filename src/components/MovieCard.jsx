import { Link } from 'react-router-dom';
import Poster from './Poster';
import { CardActions } from './ListActions';
import { StarIcon } from './Icons';
import { formatRating } from '../utils/formatters';

export default function MovieCard({ movie }) {
  const rating = formatRating(movie.rating);

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link" aria-label={`${movie.title}${movie.year ? `, ${movie.year}` : ''}`}>
        <Poster src={movie.poster} title={movie.title} />
        <div className="movie-card-meta">
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-sub">
            {movie.year && <span>{movie.year}</span>}
            {rating && (
              <span className="rating">
                <StarIcon /> {rating}
              </span>
            )}
            {movie.source === 'custom' && <span className="tag">Yours</span>}
          </p>
        </div>
      </Link>
      <CardActions movie={movie} />
    </article>
  );
}
