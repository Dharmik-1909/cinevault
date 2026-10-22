import { BookmarkIcon, HeartIcon } from './Icons';
import { useMovieLibrary } from '../state/MovieLibraryContext';

/** Icon-only save buttons for cards. */
export function CardActions({ movie }) {
  const { isFavorite, isWatchLater, toggleFavorite, toggleWatchLater } = useMovieLibrary();
  const fav = isFavorite(movie.id);
  const later = isWatchLater(movie.id);

  return (
    <div className="card-actions">
      <button
        type="button"
        className={`icon-btn ${fav ? 'is-on' : ''}`}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${movie.title} from Favorites` : `Add ${movie.title} to Favorites`}
        title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
        onClick={() => toggleFavorite(movie)}
      >
        <HeartIcon filled={fav} width={18} height={18} />
      </button>
      <button
        type="button"
        className={`icon-btn ${later ? 'is-on' : ''}`}
        aria-pressed={later}
        aria-label={later ? `Remove ${movie.title} from Watch Later` : `Add ${movie.title} to Watch Later`}
        title={later ? 'Remove from Watch Later' : 'Add to Watch Later'}
        onClick={() => toggleWatchLater(movie)}
      >
        <BookmarkIcon filled={later} width={18} height={18} />
      </button>
    </div>
  );
}

/** Labelled buttons for the detail page and hero. */
export function ListButtons({ movie }) {
  const { isFavorite, isWatchLater, toggleFavorite, toggleWatchLater } = useMovieLibrary();
  const fav = isFavorite(movie.id);
  const later = isWatchLater(movie.id);

  return (
    <>
      <button
        type="button"
        className={`btn ${fav ? 'btn-selected' : 'btn-secondary'}`}
        aria-pressed={fav}
        onClick={() => toggleFavorite(movie)}
      >
        <HeartIcon filled={fav} width={18} height={18} />
        {fav ? 'In Favorites' : 'Add to Favorites'}
      </button>
      <button
        type="button"
        className={`btn ${later ? 'btn-selected' : 'btn-secondary'}`}
        aria-pressed={later}
        onClick={() => toggleWatchLater(movie)}
      >
        <BookmarkIcon filled={later} width={18} height={18} />
        {later ? 'In Watch Later' : 'Add to Watch Later'}
      </button>
    </>
  );
}
