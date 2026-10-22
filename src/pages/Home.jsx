import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNowPlaying, getPopular, getTopRated, getTrending, searchMovies } from '../api/movies';
import { useAsync } from '../hooks/useAsync';
import { useMovieLibrary } from '../state/MovieLibraryContext';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import { EmptyState, ErrorState, LoadingState } from '../components/States';

const SHELVES = [
  { key: 'trending', title: 'Trending this week', load: getTrending },
  { key: 'popular', title: 'Popular', load: getPopular },
  { key: 'topRated', title: 'Top rated', load: getTopRated },
  { key: 'nowPlaying', title: 'Now playing', load: getNowPlaying },
];

function Discovery() {
  const { customAsMovies } = useMovieLibrary();
  const { data, loading, retry } = useAsync(async (signal) => {
    const results = await Promise.allSettled(SHELVES.map((s) => s.load(1, signal)));
    return results.map((r) =>
      r.status === 'fulfilled' ? { items: r.value.items } : { error: r.reason }
    );
  }, []);

  if (loading && !data) return <LoadingState label="Loading movies" />;

  const allFailed = data && data.every((r) => r.error);
  if (allFailed) {
    return (
      <>
        <ErrorState error={data[0].error} onRetry={retry} />
        {customAsMovies.length > 0 && (
          <section className="shelf">
            <h2>Your movies</h2>
            <MovieGrid movies={customAsMovies} label="Your movies" />
          </section>
        )}
      </>
    );
  }

  const trending = data[0].items || [];
  const popular = data[1].items || [];
  const featured = [...trending, ...popular].find((m) => m.backdrop);

  return (
    <>
      {featured && <Hero movie={featured} />}
      {customAsMovies.length > 0 && (
        <section className="shelf">
          <h2>Your movies</h2>
          <MovieGrid movies={customAsMovies} label="Your movies" />
        </section>
      )}
      {SHELVES.map((shelf, i) => {
        const result = data[i];
        return (
          <section className="shelf" key={shelf.key}>
            <h2>{shelf.title}</h2>
            {result.error ? (
              <p className="inline-error">
                This shelf could not load. {result.error.message}{' '}
                <button type="button" className="link-btn" onClick={retry}>Try again</button>
              </p>
            ) : result.items.length === 0 ? (
              <p className="muted">No movies to show here right now.</p>
            ) : (
              <MovieGrid movies={result.items.slice(0, 12)} label={shelf.title} />
            )}
          </section>
        );
      })}
    </>
  );
}

function SearchView({ query }) {
  const { customAsMovies } = useMovieLibrary();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('loading'); // loading | more | idle | error
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus(page === 1 ? 'loading' : 'more');
    setError(null);
    searchMovies(query, page, ctrl.signal)
      .then((r) => {
        setItems((prev) => {
          if (page === 1) return r.items;
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...r.items.filter((m) => !seen.has(m.id))];
        });
        setTotalPages(r.totalPages);
        setStatus('idle');
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e);
        setStatus('error');
      });
    return () => ctrl.abort();
  }, [query, page, nonce]);

  const q = query.toLowerCase();
  const mine = customAsMovies.filter((m) => m.title.toLowerCase().includes(q));

  return (
    <section className="shelf">
      <h1 className="page-title">Results for “{query}”</h1>

      {mine.length > 0 && (
        <>
          <h2>In your library</h2>
          <MovieGrid movies={mine} label="Matching custom movies" />
        </>
      )}

      {status === 'loading' && <LoadingState label="Searching" />}
      {status === 'error' && items.length === 0 && (
        <ErrorState error={error} onRetry={() => setNonce((n) => n + 1)} />
      )}
      {status !== 'loading' && !(status === 'error' && items.length === 0) && (
        <>
          {mine.length > 0 && items.length > 0 && <h2>From TMDb</h2>}
          {items.length === 0 && mine.length === 0 ? (
            <EmptyState
              title="No movies found"
              text="Check the spelling or try a different title."
              actionLabel="Back to discovery"
            />
          ) : (
            items.length > 0 && <MovieGrid movies={items} label="Search results" />
          )}
          {status === 'error' && (
            <p className="inline-error">
              {error?.message}{' '}
              <button type="button" className="link-btn" onClick={() => setNonce((n) => n + 1)}>Try again</button>
            </p>
          )}
          {page < totalPages && status !== 'error' && (
            <div className="load-more">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={status === 'more'}
                onClick={() => setPage((p) => p + 1)}
              >
                {status === 'more' ? 'Loading…' : 'Load more results'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function Home() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();
  return query ? <SearchView key={query} query={query} /> : <Discovery />;
}
