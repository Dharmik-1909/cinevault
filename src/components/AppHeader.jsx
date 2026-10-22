import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Brand } from './Navigation';
import { UserIcon } from './Icons';
import { useMovieLibrary } from '../state/MovieLibraryContext';

export default function AppHeader() {
  const { profile } = useMovieLibrary();

  return (
    <header className="app-header">
      <div className="header-brand"><Brand /></div>
      <SearchBar />
      {profile ? (
        <Link to="/profile" className="profile-link" aria-label={`Profile: ${profile.displayName}`}>
          <span className="avatar">{profile.displayName.charAt(0).toUpperCase()}</span>
        </Link>
      ) : (
        <Link to="/login" className="profile-link">
          <UserIcon width={18} height={18} />
          <span className="profile-link-text">Sign in</span>
        </Link>
      )}
    </header>
  );
}
