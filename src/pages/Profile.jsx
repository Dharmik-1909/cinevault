import { Link, useNavigate } from 'react-router-dom';
import { useMovieLibrary } from '../state/MovieLibraryContext';

export default function Profile() {
  const { profile, favorites, watchLater, customMovies, signOut, clearAllData } = useMovieLibrary();
  const navigate = useNavigate();
  if (!profile) return null; // RequireAuth redirects

  return (
    <section className="form-page">
      <h1 className="page-title">{profile.displayName}</h1>
      <p className="muted">{profile.email}</p>

      <dl className="stats">
        <div><dt>Favorites</dt><dd><Link to="/favorites">{favorites.length}</Link></dd></div>
        <div><dt>Watch Later</dt><dd><Link to="/watch-later">{watchLater.length}</Link></dd></div>
        <div><dt>Custom movies</dt><dd>{customMovies.length}</dd></div>
      </dl>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            signOut();
            navigate('/');
          }}
        >
          Sign out
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (window.confirm('Delete your Favorites, Watch Later and custom movies?')) clearAllData();
          }}
        >
          Clear my saved lists
        </button>
      </div>

      <div className="notice" role="note">
        Your data is stored in this browser only and can be lost if you clear site data.
      </div>
    </section>
  );
}
