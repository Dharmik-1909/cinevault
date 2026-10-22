import { tmdbGet } from './tmdbClient';
import { normalizeTmdbMovie } from '../utils/formatters';

function listResult(data) {
  return {
    items: (data.results || []).map(normalizeTmdbMovie),
    page: data.page || 1,
    totalPages: data.total_pages || 1,
  };
}

export const getPopular = (page = 1, signal) =>
  tmdbGet('/movie/popular', { page }, { signal }).then(listResult);

export const getTrending = (page = 1, signal) =>
  tmdbGet('/trending/movie/week', { page }, { signal }).then(listResult);

export const getTopRated = (page = 1, signal) =>
  tmdbGet('/movie/top_rated', { page }, { signal }).then(listResult);

export const getNowPlaying = (page = 1, signal) =>
  tmdbGet('/movie/now_playing', { page }, { signal }).then(listResult);

export const searchMovies = (query, page = 1, signal) =>
  tmdbGet('/search/movie', { query, page, include_adult: false }, { signal }).then(listResult);

/**
 * Details + credits + videos in ONE request using TMDb's append_to_response.
 * Equivalent to /movie/{id}, /movie/{id}/credits and /movie/{id}/videos,
 * without three round trips.
 */
export async function getMovieDetails(id, signal) {
  const data = await tmdbGet(
    `/movie/${id}`,
    { append_to_response: 'credits,videos' },
    { signal }
  );

  const cast = (data.credits?.cast || [])
    .slice(0, 10)
    .map((c) => ({ id: c.id, name: c.name, character: c.character || '' }));

  const videos = (data.videos?.results || []).filter(
    (v) => v.site === 'YouTube' && typeof v.key === 'string' && /^[\w-]+$/.test(v.key)
  );
  const trailer =
    videos.find((v) => v.type === 'Trailer' && v.official) ||
    videos.find((v) => v.type === 'Trailer') ||
    videos[0] ||
    null;

  return {
    movie: normalizeTmdbMovie(data),
    cast,
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    tagline: data.tagline || '',
  };
}
