import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/movies';
import { useAsync } from '../hooks/useAsync';
import { useMovieLibrary } from '../state/MovieLibraryContext';
import { customToMovie, formatDate, formatRating, formatRuntime } from '../utils/formatters';
import Poster from '../components/Poster';
import { ListButtons } from '../components/ListActions';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { PlayIcon, StarIcon } from '../components/Icons';

function DetailView({ movie, cast = [], trailerUrl, tagline, onRemove }) {
  const rating = formatRating(movie.rating);
  const runtime = formatRuntime(movie.runtime);
  const released = formatDate(movie.releaseDate) || (movie.year ? String(movie.year) : null);

  return (
    <article className="detail">
      <div className="detail-backdrop">
        {movie.backdrop && <img src={movie.backdrop} alt="" decoding="async" />}
        <div className="detail-shade" />
      </div>

      <div className="detail-main">
        <Poster src={movie.poster} title={movie.title} className="detail-poster" lazy={false} />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          {tagline && <p className="tagline">{tagline}</p>}
          <p className="detail-facts">
            {released && <span>{released}</span>}
            {runtime && <span>{runtime}</span>}
            {rating && (
              <span className="rating">
                <StarIcon /> {rating}
              </span>
            )}
          </p>
          {movie.genres.length > 0 && (
            <ul className="genres" aria-label="Genres">
              {movie.genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          )}
          <div className="detail-actions">
            <ListButtons movie={movie} />
            {trailerUrl && (
              <a className="btn btn-primary" href={trailerUrl} target="_blank" rel="noopener noreferrer">
                <PlayIcon width={16} height={16} /> Watch trailer
              </a>
            )}
            {onRemove && (
              <button type="button" className="btn btn-ghost" onClick={onRemove}>
                Delete entry
              </button>
            )}
          </div>
          <h2>Overview</h2>
          <p className="overview">{movie.overview || 'No overview is available for this movie yet.'}</p>
        </div>
      </div>

      {cast.length > 0 && (
        <section className="cast">
          <h2>Cast</h2>
          <ul>
            {cast.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
                {c.character && <span>{c.character}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function TmdbDetails({ id }) {
  const { data, loading, error, retry } = useAsync((signal) => getMovieDetails(id, signal), [id]);
  if (loading) return <LoadingState variant="detail" label="Loading movie" />;
  if (error) return <ErrorState error={error} onRetry={retry} />;
  return <DetailView {...data} />;
}

function CustomDetails({ id }) {
  const { customMovies, removeCustomMovie } = useMovieLibrary();
  const navigate = useNavigate();
  const entry = customMovies.find((m) => m.id === id);
  if (!entry) {
    return <EmptyState title="Movie not found" text="This custom entry may have been deleted." />;
  }
  return (
    <DetailView
      movie={customToMovie(entry)}
      onRemove={() => {
        if (window.confirm(`Delete “${entry.title}” from your library?`)) {
          removeCustomMovie(id);
          navigate('/');
        }
      }}
    />
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  if (id.startsWith('custom-')) return <CustomDetails id={id} />;
  if (!/^\d+$/.test(id)) {
    return <EmptyState title="Movie not found" text="That link doesn’t point to a movie." />;
  }
  return <TmdbDetails key={id} id={id} />;
}
