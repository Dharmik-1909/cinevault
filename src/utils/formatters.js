import { imageUrl } from '../api/tmdbClient';

export function yearOf(dateString) {
  if (typeof dateString !== 'string' || dateString.length < 4) return null;
  const y = Number(dateString.slice(0, 4));
  return Number.isFinite(y) && y > 1800 ? y : null;
}

export function formatRating(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n.toFixed(1) : null;
}

export function formatRuntime(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return null;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest}m`;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

export function formatDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Turn a raw TMDb movie object into the compact shape the UI uses everywhere. */
export function normalizeTmdbMovie(m) {
  return {
    id: m.id,
    source: 'tmdb',
    title: m.title || m.original_title || 'Untitled',
    overview: m.overview || '',
    poster: imageUrl(m.poster_path, 'w500'),
    backdrop: imageUrl(m.backdrop_path, 'w1280'),
    year: yearOf(m.release_date),
    releaseDate: m.release_date || null,
    rating: Number(m.vote_average) > 0 ? Number(m.vote_average) : null,
    genres: Array.isArray(m.genres) ? m.genres.map((g) => g.name) : [],
    runtime: m.runtime || null,
  };
}

export function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Custom entries are stored in their own shape; convert to the shared UI shape. */
export function customToMovie(c) {
  const rating = Number(c.rating);
  return {
    id: c.id,
    source: 'custom',
    title: c.title,
    overview: c.description || '',
    poster: c.posterUrl && isHttpUrl(c.posterUrl) ? c.posterUrl : null,
    backdrop: null,
    year: c.year ? Number(c.year) : null,
    releaseDate: null,
    rating: Number.isFinite(rating) && rating > 0 ? rating : null,
    genres: c.genre ? [c.genre] : [],
    runtime: null,
  };
}

/** The small snapshot stored inside Favorites / Watch Later lists. */
export function snapshot(movie) {
  return {
    id: movie.id,
    source: movie.source,
    title: movie.title,
    poster: movie.poster || null,
    backdrop: movie.backdrop || null,
    year: movie.year || null,
    rating: movie.rating || null,
    overview: movie.overview || '',
  };
}
