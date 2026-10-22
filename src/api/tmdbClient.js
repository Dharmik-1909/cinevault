// Single module that owns TMDb base URL, auth header, query handling and
// error normalisation. Components never call fetch() directly.

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
// Supports either credential type from https://www.themoviedb.org/settings/api :
//  - VITE_TMDB_API_KEY            (32-character "API Key", sent as ?api_key=)
//  - VITE_TMDB_READ_ACCESS_TOKEN  (long "API Read Access Token", sent as Bearer header)
const API_KEY = (import.meta.env.VITE_TMDB_API_KEY || '').trim();
const TOKEN = (import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || '').trim();

export class ApiError extends Error {
  /** kind: 'config' | 'network' | 'rate' | 'auth' | 'notfound' | 'http' */
  constructor(kind, message, status) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function hasToken() {
  const placeholder = (v) => !v || v.startsWith('your_');
  return !placeholder(API_KEY) || !placeholder(TOKEN);
}

const cache = new Map(); // successful responses only, avoids duplicate requests

export async function tmdbGet(path, params = {}, { signal } = {}) {
  if (!hasToken()) {
    throw new ApiError(
      'config',
      'TMDb is not configured yet. Add your API key to .env.local and restart the dev server.'
    );
  }

  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const useKey = Boolean(API_KEY) && !API_KEY.startsWith('your_');
  if (useKey) url.searchParams.set('api_key', API_KEY);
  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  let res;
  try {
    res = await fetch(key, {
      signal,
      headers: useKey ? { accept: 'application/json' } : { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' },
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('network', 'Could not reach TMDb. Check your internet connection and try again.');
  }

  if (res.status === 429) throw new ApiError('rate', 'Too many requests right now. Wait a moment, then try again.', 429);
  if (res.status === 401) throw new ApiError('auth', 'TMDb rejected the API key. Check the value in .env.local.', 401);
  if (res.status === 404) throw new ApiError('notfound', 'That movie could not be found.', 404);
  if (!res.ok) throw new ApiError('http', 'TMDb had a problem loading this. Please try again.', res.status);

  const data = await res.json();
  cache.set(key, data);
  return data;
}

/** Build an image URL only from a well-formed TMDb path; otherwise return null. */
export function imageUrl(path, size = 'w500') {
  if (typeof path !== 'string' || !/^\/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(path)) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}
