import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { load, remove, sanitizeList, save, userKey } from '../utils/storage';
import { customToMovie, snapshot } from '../utils/formatters';
import { getSessionUser, loginUser, logoutUser, registerUser } from '../utils/auth';
import { useToast } from '../components/Toast';

const MovieLibraryContext = createContext(null);

const loadList = (userId, name) => (userId ? sanitizeList(load(userKey(userId, name), [], Array.isArray)) : []);
const loadAll = (userId) => ({
  favorites: loadList(userId, 'favorites'),
  watchLater: loadList(userId, 'watchLater'),
  customMovies: loadList(userId, 'customMovies'),
});

function newCustomId() {
  return `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function MovieLibraryProvider({ children }) {
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(getSessionUser);
  const [data, setData] = useState(() => loadAll(user?.id));
  const { favorites, watchLater, customMovies } = data;

  // Persist the signed-in user's lists. Signed-out visitors have no saved lists.
  useEffect(() => {
    if (!user) return;
    save(userKey(user.id, 'favorites'), data.favorites);
    save(userKey(user.id, 'watchLater'), data.watchLater);
    save(userKey(user.id, 'customMovies'), data.customMovies);
  }, [user, data]);

  const patch = useCallback((changes) => setData((d) => ({ ...d, ...changes })), []);

  const has = (list, id) => list.some((m) => String(m.id) === String(id));
  const isFavorite = useCallback((id) => has(favorites, id), [favorites]);
  const isWatchLater = useCallback((id) => has(watchLater, id), [watchLater]);

  const requireLogin = useCallback(() => {
    notify('Sign in to save movies to your lists');
    navigate('/login', { state: { from: location } });
  }, [notify, navigate, location]);

  const toggleList = useCallback(
    (field, label) => (movie) => {
      if (!user) return requireLogin();
      setData((d) => {
        const list = d[field];
        if (has(list, movie.id)) return { ...d, [field]: list.filter((m) => String(m.id) !== String(movie.id)) };
        return { ...d, [field]: [snapshot(movie), ...list] };
      });
      notify(`${has(data[field], movie.id) ? 'Removed' : 'Added'} “${movie.title}” ${has(data[field], movie.id) ? 'from' : 'to'} ${label}`);
      return undefined;
    },
    [user, requireLogin, notify, data]
  );

  const toggleFavorite = useMemo(() => toggleList('favorites', 'Favorites'), [toggleList]);
  const toggleWatchLater = useMemo(() => toggleList('watchLater', 'Watch Later'), [toggleList]);

  const addCustomMovie = useCallback(
    (fields) => {
      const entry = {
        id: newCustomId(),
        title: fields.title.trim(),
        year: fields.year ? Number(fields.year) : undefined,
        description: fields.description?.trim() || undefined,
        posterUrl: fields.posterUrl?.trim() || undefined,
        genre: fields.genre?.trim() || undefined,
        rating: fields.rating !== '' && fields.rating != null ? Number(fields.rating) : undefined,
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, customMovies: [entry, ...d.customMovies] }));
      notify(`Saved “${entry.title}” to your library`);
      return entry;
    },
    [notify]
  );

  const removeCustomMovie = useCallback(
    (id) => {
      setData((d) => ({
        favorites: d.favorites.filter((m) => String(m.id) !== String(id)),
        watchLater: d.watchLater.filter((m) => String(m.id) !== String(id)),
        customMovies: d.customMovies.filter((m) => m.id !== id),
      }));
      notify('Removed your custom movie');
    },
    [notify]
  );

  const finishAuth = useCallback((u) => {
    setUser(u);
    setData(loadAll(u.id));
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      const res = await loginUser(email, password);
      if (res.ok) finishAuth(res.user);
      return res;
    },
    [finishAuth]
  );

  const signUp = useCallback(
    async (fields) => {
      const res = await registerUser(fields);
      if (res.ok) finishAuth(res.user);
      return res;
    },
    [finishAuth]
  );

  const signOut = useCallback(() => {
    logoutUser();
    setUser(null);
    setData({ favorites: [], watchLater: [], customMovies: [] });
    notify('You have been signed out');
  }, [notify]);

  const clearAllData = useCallback(() => {
    if (!user) return;
    ['favorites', 'watchLater', 'customMovies'].forEach((n) => remove(userKey(user.id, n)));
    setData({ favorites: [], watchLater: [], customMovies: [] });
    notify('Your saved lists were cleared');
  }, [user, notify]);

  const customAsMovies = useMemo(() => customMovies.map(customToMovie), [customMovies]);

  const value = {
    favorites,
    watchLater,
    customMovies,
    customAsMovies,
    profile: user, // { id, email, displayName } or null
    isFavorite,
    isWatchLater,
    toggleFavorite,
    toggleWatchLater,
    addCustomMovie,
    removeCustomMovie,
    signIn,
    signUp,
    signOut,
    clearAllData,
  };

  return <MovieLibraryContext.Provider value={value}>{children}</MovieLibraryContext.Provider>;
}

export function useMovieLibrary() {
  const ctx = useContext(MovieLibraryContext);
  if (!ctx) throw new Error('useMovieLibrary must be used inside MovieLibraryProvider');
  return ctx;
}
