import { Link } from 'react-router-dom';
import { AlertIcon } from './Icons';

export function LoadingState({ variant = 'grid', count = 12, label = 'Loading' }) {
  if (variant === 'detail') {
    return (
      <div className="skeleton-detail" role="status" aria-label={label}>
        <div className="skeleton skeleton-backdrop" />
        <div className="skeleton-lines">
          <div className="skeleton" style={{ height: 36, width: '50%' }} />
          <div className="skeleton" style={{ height: 16, width: '30%' }} />
          <div className="skeleton" style={{ height: 90, width: '80%' }} />
        </div>
      </div>
    );
  }
  return (
    <div role="status" aria-label={label}>
      <ul className="movie-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <div className="skeleton skeleton-poster" />
            <div className="skeleton" style={{ height: 14, width: '70%', marginTop: 10 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const isConfig = error?.kind === 'config';
  const canRetry = onRetry && !isConfig && error?.kind !== 'notfound';

  return (
    <div className="state-box" role="alert">
      <AlertIcon />
      <h2>{isConfig ? 'Connect TMDb to see movies' : 'Something went wrong'}</h2>
      <p>{error?.message || 'We could not load this right now. Please try again.'}</p>
      {isConfig && (
        <ol className="setup-steps">
          <li>Create a free account at themoviedb.org and request API access in your account settings.</li>
          <li>Copy your <strong>API Key</strong> (or the API Read Access Token).</li>
          <li>Create <code>.env.local</code> next to <code>package.json</code> with <code>VITE_TMDB_API_KEY=your_key</code>.</li>
          <li>Restart <code>npm run dev</code>.</li>
        </ol>
      )}
      <div className="state-actions">
        {canRetry && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        )}
        <Link to="/add" className="btn btn-secondary">
          {isConfig ? 'Add a movie manually' : 'Go to Add Movie'}
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({ title, text, actionLabel = 'Browse movies', to = '/' }) {
  return (
    <div className="state-box">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="state-actions">
        <Link to={to} className="btn btn-primary">
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
