import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CloseIcon, SearchIcon } from './Icons';

/** Debounced title search. Typing navigates to /?q=… ; clearing returns to discovery. */
export default function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = pathname === '/' ? params.get('q') || '' : '';

  const [value, setValue] = useState(urlQuery);
  const lastSent = useRef(urlQuery.trim());

  // Keep the input in sync when the URL changes from elsewhere (e.g. clicking Home).
  useEffect(() => {
    if (urlQuery.trim() !== lastSent.current) {
      lastSent.current = urlQuery.trim();
      setValue(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === lastSent.current) return undefined;
    const t = setTimeout(() => {
      lastSent.current = trimmed;
      if (trimmed) navigate(`/?q=${encodeURIComponent(trimmed)}`, { replace: pathname === '/' });
      else if (pathname === '/') navigate('/', { replace: true });
    }, 400);
    return () => clearTimeout(t);
  }, [value, pathname, navigate]);

  const clear = () => {
    setValue('');
    lastSent.current = '';
    if (pathname === '/') navigate('/', { replace: true });
  };

  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = value.trim();
        lastSent.current = trimmed;
        navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
      }}
    >
      <label htmlFor="search-input" className="visually-hidden">
        Search movies by title
      </label>
      <SearchIcon className="search-icon" />
      <input
        id="search-input"
        type="search"
        placeholder="Search movies by title"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        maxLength={100}
      />
      {value && (
        <button type="button" className="search-clear" onClick={clear} aria-label="Clear search">
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </form>
  );
}
