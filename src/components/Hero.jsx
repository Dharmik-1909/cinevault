import { Link } from 'react-router-dom';
import { ListButtons } from './ListActions';
import { formatRating } from '../utils/formatters';
import { StarIcon } from './Icons';

export default function Hero({ movie }) {
  const rating = formatRating(movie.rating);
  return (
    <section className="hero" aria-label="Featured movie">
      <img className="hero-image" src={movie.backdrop} alt="" decoding="async" />
      <div className="hero-shade" />
      <div className="hero-body">
        <p className="hero-kicker">Trending this week</p>
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-meta">
          {movie.year && <span>{movie.year}</span>}
          {rating && (
            <span className="rating">
              <StarIcon /> {rating}
            </span>
          )}
        </p>
        {movie.overview && <p className="hero-overview">{movie.overview}</p>}
        <div className="hero-actions">
          <Link to={`/movie/${movie.id}`} className="btn btn-primary">
            View details
          </Link>
          <ListButtons movie={movie} />
        </div>
      </div>
    </section>
  );
}
